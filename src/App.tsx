import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import AuthForm from '@/components/auth-form'
import LibraryPage from '@/pages/library'
import Sidebar, { type Page } from '@/components/layout/sidebar'
import StatsPage from '@/pages/stats'


function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [page, setPage] = useState<Page>('library')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!ready) return null
  if (!session) return <AuthForm />

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        page={page}
        onNavigate={setPage}
        email={session.user.email ?? ''}
        onSignOut={() => supabase.auth.signOut()}
      />
      <main className="flex-1 min-w-0">
        {page === 'library' ? <LibraryPage /> : <StatsPage />}
      </main>
    </div>
  )
}

export default App