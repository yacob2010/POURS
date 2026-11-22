import { useState, useEffect, useRef, type FormEvent } from "react";
import type { Wine, WineInput, CustomValue } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const BASE_TYPES = ["Red", "White", "Rosé", "Blend", "Sparkling", "Dessert", "Fortified"];

const SUBTYPES_BY_TYPE: Record<string, string[]> = {
  Red: ["Pinot Noir", "Cabernet Sauvignon", "Merlot", "Syrah/Shiraz", "Malbec", "Sangiovese", "Zinfandel", "Grenache"],
  White: ["Chardonnay", "Sauvignon Blanc", "Riesling", "Pinot Grigio", "Gewürztraminer", "Viognier", "Albariño"],
  "Rosé": ["Grenache Rosé", "Pinot Noir Rosé", "Syrah Rosé"],
  Blend: ["Red Blend", "White Blend", "GSM", "Bordeaux Blend", "Meritage", "Super Tuscan"],
  Sparkling: ["Champagne", "Prosecco", "Cava", "Crémant", "Pét-Nat"],
  Dessert: ["Sauternes", "Late Harvest", "Moscato", "Tokaji", "Beerenauslese"],
  Fortified: ["Port", "Sherry", "Madeira", "Marsala"],
};

const BASE_REGIONS = [
  "Bordeaux", "Burgundy", "Champagne", "Tuscany", "Napa Valley", "Rioja",
  "Barossa Valley", "Mosel", "Douro Valley", "Mendoza", "Rhône Valley",
  "Piedmont", "Alsace", "Willamette Valley", "Marlborough",
];

const BASE_DESCRIPTORS = [
  "dry", "fruity", "acidic", "tannins", "smooth", "oak",
  "spicy", "floral", "rich", "crisp", "herbaceous", "earthy",
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  wine?: Wine;
  customValues: CustomValue[];
  onSave: (input: WineInput) => Promise<void>;
  onAddCustomValue: (category: string, value: string) => Promise<void>;
}

type FormState = {
  name: string; type: string; subType: string; region: string;
  vintage: string; pricePaid: string; rating: number;
  tastingDate: string; notes: string; descriptors: string[];
};

const emptyForm = (): FormState => ({
  name: "", type: "", subType: "", region: "", vintage: "",
  pricePaid: "", rating: 7, tastingDate: "", notes: "", descriptors: [],
});

export default function WineFormModal({
  open, onOpenChange, wine, customValues, onSave, onAddCustomValue,
}: Props) {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [hasRating, setHasRating] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [typeOther, setTypeOther] = useState("");
  const [showTypeOther, setShowTypeOther] = useState(false);
  const [subTypeOther, setSubTypeOther] = useState("");
  const [showSubTypeOther, setShowSubTypeOther] = useState(false);
  const [regionOther, setRegionOther] = useState("");
  const [showRegionOther, setShowRegionOther] = useState(false);
  const [descriptorInput, setDescriptorInput] = useState("");
  const [showDescriptorInput, setShowDescriptorInput] = useState(false);
  const descriptorRef = useRef<HTMLInputElement>(null);

  const isEditing = !!wine;

  const customTypes = customValues.filter(v => v.category === "type").map(v => v.value);
  const customSubTypes = customValues.filter(v => v.category === "subType").map(v => v.value);
  const customRegions = customValues.filter(v => v.category === "region").map(v => v.value);
  const customDescriptors = customValues.filter(v => v.category === "descriptor").map(v => v.value);

  const allTypes = [...BASE_TYPES, ...customTypes.filter(v => !BASE_TYPES.includes(v))];
  const baseSubTypes = form.type ? (SUBTYPES_BY_TYPE[form.type] ?? []) : [];
  const allSubTypes = [...baseSubTypes, ...customSubTypes.filter(v => !baseSubTypes.includes(v))];
  const allRegions = [...BASE_REGIONS, ...customRegions.filter(v => !BASE_REGIONS.includes(v))];
  const allDescriptors = [...BASE_DESCRIPTORS, ...customDescriptors.filter(v => !BASE_DESCRIPTORS.includes(v))];

  useEffect(() => {
    if (wine) {
      setForm({
        name: wine.name,
        type: wine.type ?? "",
        subType: wine.subType ?? "",
        region: wine.region ?? "",
        vintage: wine.vintage?.toString() ?? "",
        pricePaid: wine.pricePaid?.toString() ?? "",
        rating: wine.rating ?? 7,
        tastingDate: wine.tastingDate ?? "",
        notes: wine.notes ?? "",
        descriptors: wine.descriptors ?? [],
      });
      setHasRating(wine.rating != null);
    } else {
      setForm(emptyForm());
      setHasRating(true);
    }
    setShowTypeOther(false); setTypeOther("");
    setShowSubTypeOther(false); setSubTypeOther("");
    setShowRegionOther(false); setRegionOther("");
    setShowDescriptorInput(false); setDescriptorInput("");
    setSaveError(null);
  }, [wine, open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload: WineInput = {
      name: form.name.trim(),
      category: wine?.category ?? "Wine",
      brand: wine?.brand ?? null,
      type: form.type || null,
      subType: form.subType || null,
      region: form.region || null,
      vintage: form.vintage ? parseInt(form.vintage) : null,
      pricePaid: form.pricePaid ? parseFloat(form.pricePaid) : null,
      rating: hasRating ? form.rating : null,
      tastingDate: form.tastingDate || null,
      notes: form.notes.trim() || null,
      descriptors: form.descriptors,
    };

    setSaving(true);
    setSaveError(null);
    try {
      await onSave(payload);
      onOpenChange(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleDescriptor = (d: string) => {
    setForm(f => ({
      ...f,
      descriptors: f.descriptors.includes(d)
        ? f.descriptors.filter(x => x !== d)
        : [...f.descriptors, d],
    }));
  };

  const saveCustomType = async () => {
    const val = typeOther.trim();
    if (!val) return;
    await onAddCustomValue("type", val);
    setForm(f => ({ ...f, type: val, subType: "" }));
    setShowTypeOther(false); setTypeOther("");
  };

  const saveCustomSubType = async () => {
    const val = subTypeOther.trim();
    if (!val) return;
    await onAddCustomValue("subType", val);
    setForm(f => ({ ...f, subType: val }));
    setShowSubTypeOther(false); setSubTypeOther("");
  };

  const saveCustomRegion = async () => {
    const val = regionOther.trim();
    if (!val) return;
    await onAddCustomValue("region", val);
    setForm(f => ({ ...f, region: val }));
    setShowRegionOther(false); setRegionOther("");
  };

  const addDescriptor = async () => {
    const val = descriptorInput.trim().toLowerCase();
    if (!val) return;
    if (!allDescriptors.includes(val)) {
      await onAddCustomValue("descriptor", val);
    }
    setForm(f => ({
      ...f,
      descriptors: f.descriptors.includes(val) ? f.descriptors : [...f.descriptors, val],
    }));
    setDescriptorInput(""); setShowDescriptorInput(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wide text-lg">
            {isEditing ? "Edit wine" : "Add a wine"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Château Margaux"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label>Type</Label>
            <div className="flex flex-wrap gap-2">
              {allTypes.map(t => (
                <button
                  key={t} type="button"
                  onClick={() => {
                    setForm(f => ({ ...f, type: f.type === t ? "" : t, subType: "" }));
                    setShowTypeOther(false);
                  }}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    form.type === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowTypeOther(v => !v)}
                className="px-3 py-1 rounded-full text-xs border border-dashed border-border text-muted-foreground hover:border-primary/40 transition-colors"
              >
                Other…
              </button>
            </div>
            {showTypeOther && (
              <div className="flex gap-2">
                <Input
                  autoFocus
                  placeholder="Custom type"
                  value={typeOther}
                  onChange={e => setTypeOther(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), saveCustomType())}
                  className="text-sm h-8"
                />
                <Button type="button" size="sm" onClick={saveCustomType} disabled={!typeOther.trim()} className="h-8">Add</Button>
              </div>
            )}
          </div>

          {/* SubType — only when a type is selected */}
          {form.type && (
            <div className="space-y-1.5">
              <Label>Sub-type</Label>
              {allSubTypes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allSubTypes.map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => {
                        setForm(f => ({ ...f, subType: f.subType === s ? "" : s }));
                        setShowSubTypeOther(false);
                      }}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        form.subType === s
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-primary/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowSubTypeOther(v => !v)}
                    className="px-3 py-1 rounded-full text-xs border border-dashed border-border text-muted-foreground hover:border-primary/40 transition-colors"
                  >
                    Other…
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubTypeOther(v => !v)}
                    className="px-3 py-1 rounded-full text-xs border border-dashed border-border text-muted-foreground hover:border-primary/40 transition-colors"
                  >
                    Add sub-type…
                  </button>
                </div>
              )}
              {showSubTypeOther && (
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    placeholder="Custom sub-type"
                    value={subTypeOther}
                    onChange={e => setSubTypeOther(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), saveCustomSubType())}
                    className="text-sm h-8"
                  />
                  <Button type="button" size="sm" onClick={saveCustomSubType} disabled={!subTypeOther.trim()} className="h-8">Add</Button>
                </div>
              )}
              {form.subType && (
                <p className="text-xs text-muted-foreground">Selected: <span className="font-medium text-foreground">{form.subType}</span></p>
              )}
            </div>
          )}

          {/* Region */}
          <div className="space-y-1.5">
            <Label>Region</Label>
            <Select
              value={form.region === "" ? "__none__" : allRegions.includes(form.region) ? form.region : "__custom__"}
              onValueChange={v => {
                if (v === "__none__") { setForm(f => ({ ...f, region: "" })); setShowRegionOther(false); }
                else if (v === "__other__") { setShowRegionOther(true); }
                else { setForm(f => ({ ...f, region: v })); setShowRegionOther(false); }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region">
                  {form.region || "Select region"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— None —</SelectItem>
                {allRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                <SelectItem value="__other__">Other…</SelectItem>
              </SelectContent>
            </Select>
            {showRegionOther && (
              <div className="flex gap-2">
                <Input
                  autoFocus
                  placeholder="Custom region"
                  value={regionOther}
                  onChange={e => setRegionOther(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), saveCustomRegion())}
                  className="text-sm h-8"
                />
                <Button type="button" size="sm" onClick={saveCustomRegion} disabled={!regionOther.trim()} className="h-8">Add</Button>
              </div>
            )}
          </div>

          {/* Vintage + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="vintage">Vintage</Label>
              <Input
                id="vintage" type="number" placeholder="e.g. 2018"
                min={1900} max={new Date().getFullYear()}
                value={form.vintage}
                onChange={e => setForm(f => ({ ...f, vintage: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Price paid ($)</Label>
              <Input
                id="price" type="number" step="0.01" min={0} placeholder="0.00"
                value={form.pricePaid}
                onChange={e => setForm(f => ({ ...f, pricePaid: e.target.value }))}
              />
            </div>
          </div>

          {/* Tasting date */}
          <div className="space-y-1.5">
            <Label htmlFor="tastingDate">Tasting date</Label>
            <Input
              id="tastingDate" type="date" value={form.tastingDate}
              onChange={e => setForm(f => ({ ...f, tastingDate: e.target.value }))}
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Rating</Label>
              <div className="flex items-center gap-2">
                <Checkbox id="hasRating" checked={hasRating} onCheckedChange={v => setHasRating(!!v)} />
                <label htmlFor="hasRating" className="text-xs text-muted-foreground cursor-pointer">Rate this wine</label>
              </div>
            </div>
            {hasRating && (
              <div className="flex items-center gap-3">
                <Slider min={1} max={10} step={1} value={[form.rating]}
                  onValueChange={([v]) => setForm(f => ({ ...f, rating: v }))}
                  className="flex-1"
                />
                <span className="w-10 text-right text-sm font-semibold text-primary">{form.rating}/10</span>
              </div>
            )}
          </div>

          {/* Descriptors */}
                   <div className="space-y-2">
            <Label>Descriptors</Label>
            <div className="flex flex-wrap gap-2">
              {allDescriptors.map(d => (
                <button
                  key={d} type="button"
                  onClick={() => toggleDescriptor(d)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    form.descriptors.includes(d)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {d}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setShowDescriptorInput(v => !v);
                  setTimeout(() => descriptorRef.current?.focus(), 50);
                }}
                className="px-3 py-1 rounded-full text-xs border border-dashed border-border text-muted-foreground hover:border-primary/40 transition-colors"
              >
                +
              </button>
            </div>
            {showDescriptorInput && (
              <div className="flex gap-2">
                <Input
                  ref={descriptorRef}
                  placeholder="Add descriptor"
                  value={descriptorInput}
                  onChange={e => setDescriptorInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addDescriptor())}
                  className="text-sm h-8"
                />
                <Button type="button" size="sm" onClick={addDescriptor} disabled={!descriptorInput.trim()} className="h-8">Add</Button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Tasting notes</Label>
            <Textarea
              id="notes"
              placeholder="What do you taste? What does it remind you of?"
              rows={3} value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {saveError && <p className="text-sm text-destructive">{saveError}</p>}

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving || !form.name.trim()}>
              {saving ? "Saving..." : isEditing ? "Save changes" : "Add wine"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}