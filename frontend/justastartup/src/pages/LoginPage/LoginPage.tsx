import { supabase } from '../../database/supaBaseClient'
import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { AuthNavbar } from '../../components';
import './LoginPage.css'

export default function LoginPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
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

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col">
      <AuthNavbar />
      <div className="login-page">
        <div className="login-content">
          <div className="loading-container">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    </div>
    )
  }

  if (!session) {
    return (
      <div className="h-screen w-screen flex flex-col">
      <AuthNavbar />
      <div className="login-page">
        <div className="login-content">
          <div className="login-hero">
            <h1>Welcome to JustAStartUp</h1>
            <p className="hero-subtitle">Your future starts up here.</p>
          </div>
          <div className="auth-container">
            <Auth 
              supabaseClient={supabase} 
              appearance={{ theme: ThemeSupa }} 
              providers={['google']}
              redirectTo={window.location.origin}
            />
          </div>
        </div>
      </div>
    </div>
    )
  }
  else {
    return (
      <div className="h-screen w-screen flex flex-col">
      <AuthNavbar />
      <div className="login-page">
        <div className="login-content">
          <div className="success-container">
            <h2>Welcome back!</h2>
            <p>Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
      </div>
    )
  }
}