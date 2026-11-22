import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts'
import { useWines } from '@/hooks/use-wines'
import type { Wine } from '@/types'

const CHART_COLORS = ['#d4526e', '#8b2040', '#f5b8c6', '#b03a5a', '#e8a0b0', '#c2607a']

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

function countBy(items: string[]) {
  const map = new Map<string, number>()
  items.forEach((i) => map.set(i, (map.get(i) ?? 0) + 1))
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
}

function computeStats(wines: Wine[]) {
  const rated = wines.filter((w) => w.rating != null)
  const prices = wines.filter((w) => w.pricePaid != null).map((w) => w.pricePaid!)

  return {
    totalWines: wines.length,
    averageRating: rated.length ? rated.reduce((s, w) => s + w.rating!, 0) / rated.length : null,
    averagePrice: prices.length ? prices.reduce((s, p) => s + p, 0) / prices.length : null,
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
    highestRated: rated.length ? rated.reduce((best, w) => (w.rating! > best.rating! ? w : best)) : null,
    recentWines: [...wines]
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 5),
    byType: countBy(wines.map((w) => w.type).filter(Boolean) as string[]).map(([type, count]) => ({ type, count })),
    byRegion: countBy(wines.map((w) => w.region).filter(Boolean) as string[]).map(([region, count]) => ({ region, count })),
    descriptors: countBy(wines.flatMap((w) => w.descriptors)).map(([descriptor, count]) => ({ descriptor, count })),
  }
}

export default function StatsPage() {
  const { wines, loading } = useWines()
  const s = useMemo(() => computeStats(wines), [wines])

  return (
    <div>
      <div className="px-6 py-6 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">My Stats</h1>
        <p className="text-sm text-muted-foreground">Your wine collection at a glance</p>
      </div>

      {loading ? (
        <p className="p-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="p-6 space-y-8 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total wines" value={s.totalWines} />
            <StatCard
              label="Avg rating"
              value={s.averageRating != null ? s.averageRating.toFixed(1) : '—'}
              sub={s.averageRating != null ? 'out of 10' : undefined}
            />
            <StatCard label="Avg price" value={s.averagePrice != null ? `$${s.averagePrice.toFixed(0)}` : '—'} />
            <StatCard
              label="Price range"
              value={
                s.minPrice != null && s.maxPrice != null
                  ? `$${s.minPrice.toFixed(0)}–$${s.maxPrice.toFixed(0)}`
                  : '—'
              }
            />
          </div>

          {s.highestRated && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <p className="text-xs text-primary uppercase tracking-wider font-semibold mb-2">Highest rated</p>
              <p className="font-display text-xl tracking-wide text-foreground">{s.highestRated.name}</p>
              <div className="flex items-center gap-3 mt-1">
                {s.highestRated.type && <span className="text-sm text-muted-foreground">{s.highestRated.type}</span>}
                {s.highestRated.region && <span className="text-sm text-muted-foreground">{s.highestRated.region}</span>}
                <span className="text-sm font-bold text-primary">{s.highestRated.rating}/10</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Wines by type</h2>
              {s.byType.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={s.byType}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value, x, y, textAnchor }) => (
                        <text x={x} y={y} textAnchor={textAnchor} fill="currentColor" fontSize={12}>
                          {`${name} (${value})`}
                        </text>
                      )}
                      labelLine={false}
                    >
                      {s.byType.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        color: 'var(--foreground)',
                      }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />`
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
              )}
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Wines by region</h2>
              {s.byRegion.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={s.byRegion.slice(0, 8)} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'currentColor' }} allowDecimals={false} />
                    <YAxis type="category" dataKey="region" tick={{ fontSize: 11, fill: 'currentColor' }} width={90} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        color: 'var(--foreground)',
                      }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {s.byRegion.slice(0, 8).map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Most used descriptors</h2>
            {s.descriptors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {s.descriptors.map((d, i) => (
                  <div
                    key={d.descriptor}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                    style={{
                      backgroundColor: `${CHART_COLORS[i % CHART_COLORS.length]}22`,
                      color: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  >
                    <span className="font-medium">{d.descriptor}</span>
                    <span className="text-xs opacity-80">({d.count})</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No descriptors added yet.</p>
            )}
          </div>

          {s.recentWines.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Recently added</h2>
              <div className="space-y-3">
                {s.recentWines.map((wine) => (
                  <div key={wine.id} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium text-foreground">{wine.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {[wine.type, wine.region].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <div className="text-right">
                      {wine.rating != null && <p className="text-sm font-bold text-primary">{wine.rating}/10</p>}
                      <p className="text-xs text-muted-foreground">
                        {new Date(wine.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}