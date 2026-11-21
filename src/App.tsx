import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import AuthForm from '@/components/auth-form'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

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
    <div className="p-8 space-y-4">
      <h1 className="font-display text-5xl tracking-wide">POURS</h1>
      <p className="text-muted-foreground">Signed in as {session.user.email}</p>
      <Button onClick={() => supabase.auth.signOut()}>Sign out</Button>
    </div> 
  )
}

export default App