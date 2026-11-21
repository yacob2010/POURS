import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useWines } from "@/hooks/use-wines";
import { useCustomValues } from "@/hooks/use-custom-values";
import type { Wine } from "@/types";
import WineCard from "@/components/wines/wine-card";
import WineDetailModal from "@/components/wines/wine-detail-modal";
import WineFormModal from "@/components/wines/wine-form-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/hooks/use-theme";

const BASE_TYPES = ["Red", "White", "Rosé", "Blend", "Sparkling", "Dessert", "Fortified"];
const SORT_OPTIONS = [
  { value: "dateAdded", label: "Date added" },
  { value: "name", label: "Name" },
  { value: "rating", label: "Rating" },
  { value: "pricePaid", label: "Price" },
  { value: "tastingDate", label: "Tasting date" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export default function LibraryPage() {
  const { theme, toggle } = useTheme();
  const { wines, loading, error, addWine, updateWine, deleteWine } = useWines();
  const { customValues, addCustomValue } = useCustomValues();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sort, setSort] = useState<SortKey>("dateAdded");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [editingWine, setEditingWine] = useState<Wine | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const typeOptions = useMemo(() => {
    const used = wines.map((w) => w.type).filter((t): t is string => !!t);
    return [...new Set([...BASE_TYPES, ...used])];
  }, [wines]);

  const visibleWines = useMemo(() => {
    let result = [...wines];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          (w.region?.toLowerCase() ?? "").includes(q) ||
          (w.type?.toLowerCase() ?? "").includes(q) ||
          (w.subType?.toLowerCase() ?? "").includes(q),
      );
    }
    if (typeFilter) result = result.filter((w) => w.type === typeFilter);
    result.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp =
        typeof av === "string" && typeof bv === "string"
          ? av.localeCompare(bv)
          : av < bv ? -1 : av > bv ? 1 : 0;
      return order === "asc" ? cmp : -cmp;
    });
    return result;
  }, [wines, search, typeFilter, sort, order]);

  const formOpen = showAddModal || editingWine !== null;
  const closeForm = () => {
    setShowAddModal(false);
    setEditingWine(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <h1 className="font-display text-3xl tracking-wide text-foreground">POURS</h1>
              {!loading && (
                <p className="text-sm text-muted-foreground">
                  {visibleWines.length} {visibleWines.length === 1 ? "wine" : "wines"}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" onClick={toggle}>
                {theme === "dark" ? "Light" : "Dark"}
              </Button>
              <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
                Sign out
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add wine
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-48">
              <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <Input
                placeholder="Search wines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={typeFilter || "_all"} onValueChange={(v) => setTypeFilter(v === "_all" ? "" : v)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All types</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
              title={order === "asc" ? "Ascending" : "Descending"}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
                {order === "asc" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21l3.75-3.75" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-xl" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-muted-foreground">Something went wrong loading your wines.</p>
              <p className="text-xs text-destructive mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && visibleWines.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center max-w-sm mx-auto">
              {search || typeFilter ? (
                <>
                  <p className="font-medium text-foreground mb-1">No wines found</p>
                  <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                  <Button variant="ghost" onClick={() => { setSearch(""); setTypeFilter(""); }}>
                    Clear filters
                  </Button>
                </>
              ) : (
                <>
                  <p className="font-medium text-foreground mb-1">Your cellar is empty</p>
                  <p className="text-sm text-muted-foreground mb-4">Add your first wine to get started.</p>
                  <Button onClick={() => setShowAddModal(true)}>Add wine</Button>
                </>
              )}
            </div>
          )}

          {!loading && !error && visibleWines.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleWines.map((wine) => (
                <WineCard key={wine.id} wine={wine} onClick={() => setSelectedWine(wine)} />
              ))}
            </div>
          )}
        </div>
      </main>

      <WineDetailModal
        wine={selectedWine}
        onClose={() => setSelectedWine(null)}
        onEdit={(w) => { setSelectedWine(null); setEditingWine(w); }}
        onDelete={deleteWine}
      />
      <WineFormModal
        open={formOpen}
        onOpenChange={(v) => { if (!v) closeForm(); }}
        wine={editingWine ?? undefined}
        customValues={customValues}
        onAddCustomValue={addCustomValue}
        onSave={(input) => (editingWine ? updateWine(editingWine.id, input) : addWine(input))}
      />
    </div>
  );
}