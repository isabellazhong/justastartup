import { supabase } from '../../database/supaBaseClient'
import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'

export default function LoginPage() {
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        navigate('/')
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        navigate('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} />)
  }
  else {
    return (<div>Logged in!</div>)
  }
}