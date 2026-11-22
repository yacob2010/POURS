import { cn } from '@/lib/utils'

export type Page = 'library' | 'stats'

const navItems: { label: string; page: Page; icon: React.ReactNode }[] = [
  {
    label: 'Library',
    page: 'library',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    label: 'Stats',
    page: 'stats',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
]

interface SidebarProps {
  page: Page
  onNavigate: (page: Page) => void
  email: string
  onSignOut: () => void
}

export default function Sidebar({ page, onNavigate, email, onSignOut }: SidebarProps) {
  return (
    <aside className="w-60 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="px-6 py-6 border-b border-sidebar-border">
        <span className="font-display text-2xl tracking-widest text-foreground">POURS</span>
        <p className="text-xs text-muted-foreground mt-0.5 font-light">Every glass, remembered.</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              page === item.page
                ? 'bg-primary/15 text-primary'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
        <div className="px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-primary">{email[0]?.toUpperCase() ?? 'U'}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  )
}