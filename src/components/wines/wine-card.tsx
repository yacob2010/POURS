import type { Wine } from "@/types";
import { cn } from "@/lib/utils";

interface WineCardProps {
  wine: Wine;
  onClick: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  Red: "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
  White: "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-200/10 dark:text-yellow-200 dark:border-yellow-200/25",
  Rosé: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-400/15 dark:text-pink-200 dark:border-pink-300/30",
  Blend: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-400/15 dark:text-purple-200 dark:border-purple-300/30",
  Sparkling: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-400/15 dark:text-sky-200 dark:border-sky-300/30",
  Dessert: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-400/15 dark:text-orange-200 dark:border-orange-300/30",
  Fortified: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
};

function RatingDots({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            i < rating ? "bg-primary" : "bg-border",
          )}
        />
      ))}
      <span className="ml-1.5 text-xs font-semibold text-primary">{rating}/10</span>
    </div>
  );
}

export default function WineCard({ wine, onClick }: WineCardProps) {
  const typeColor =
    (wine.type && TYPE_COLORS[wine.type]) ??
    "bg-muted text-muted-foreground border-border";

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-md transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-snug truncate group-hover:text-primary transition-colors">
            {wine.name}
          </h3>
          {wine.vintage && (
            <p className="text-xs text-muted-foreground mt-0.5">{wine.vintage}</p>
          )}
        </div>
        {wine.type && (
          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium shrink-0", typeColor)}>
            {wine.type}
          </span>
        )}
      </div>

      {wine.region && (
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {wine.region}
        </p>
      )}

      {wine.rating != null && (
        <div className="mb-2">
          <RatingDots rating={wine.rating} />
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        {wine.pricePaid != null ? (
          <span className="text-xs font-semibold text-foreground">
            ${Number(wine.pricePaid).toFixed(2)}
          </span>
        ) : (
          <span />
        )}
        {wine.tastingDate && (
          <span className="text-xs text-muted-foreground">
            {new Date(wine.tastingDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
        )}
      </div>

      {wine.descriptors.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {wine.descriptors.slice(0, 3).map((d) => (
            <span key={d} className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
              {d}
            </span>
          ))}
          {wine.descriptors.length > 3 && (
            <span className="text-xs text-muted-foreground">+{wine.descriptors.length - 3}</span>
          )}
        </div>
      )}
    </button>
  );
}