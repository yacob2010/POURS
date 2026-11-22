import { useState } from "react";
import type { Wine } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  wine: Wine | null;
  onClose: () => void;
  onEdit: (wine: Wine) => void;
  onDelete: (id: number) => Promise<void>;
}

function RatingBar({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${(rating / 10) * 100}%` }}
        />
      </div>
      <span className="text-sm font-bold text-primary w-10 text-right">{rating}/10</span>
    </div>
  );
}

export default function WineDetailModal({ wine, onClose, onEdit, onDelete }: Props) {
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!wine) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(wine.id);
      setShowDelete(false);
      onClose();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Couldn't remove. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={!!wine} onOpenChange={(v) => { if (!v) onClose(); }}>
        <DialogContent className="max-w-md max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wide text-xl pr-4 leading-snug">
              {wine.name}
            </DialogTitle>
            {wine.brand && (
              <p className="text-sm text-muted-foreground">{wine.brand}</p>
            )}
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {wine.type && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {wine.type}
                </span>
              )}
              {wine.subType && (
                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                  {wine.subType}
                </span>
              )}
              {wine.region && (
                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                  {wine.region}
                </span>
              )}
              {wine.vintage && (
                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                  {wine.vintage}
                </span>
              )}
            </div>

            {wine.rating != null && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Rating</p>
                <RatingBar rating={wine.rating} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {wine.pricePaid != null && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Price</p>
                  <p className="font-semibold text-foreground">${Number(wine.pricePaid).toFixed(2)}</p>
                </div>
              )}
              {wine.tastingDate && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Tasted</p>
                  <p className="text-sm text-foreground">
                    {new Date(wine.tastingDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              )}
            </div>

            {wine.notes && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Tasting notes</p>
                <p className="text-sm text-foreground leading-relaxed bg-muted rounded-lg px-3 py-2.5">
                  {wine.notes}
                </p>
              </div>
            )}

            {wine.descriptors.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Descriptors</p>
                <div className="flex flex-wrap gap-1.5">
                  {wine.descriptors.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Added {new Date(wine.dateAdded).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setShowDelete(true)}
            >
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button size="sm" onClick={() => onEdit(wine)}>
                Edit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              "{wine.name}" will be permanently removed from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}