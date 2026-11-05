import type { Session } from '@supabase/supabase-js'
import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { AccountContext } from './accountContext'
import '../app/app.css'
import './auth.css'

type Membership = 'checking' | 'member' | 'outsider' | 'error'

/**
 * Sin Supabase configurado deja pasar (modo local). Con Supabase pide iniciar
 * sesión por enlace mágico y comprueba que el correo esté en `members`.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  if (!supabase) return <>{children}</>
  return <CloudGate>{children}</CloudGate>
}

function CloudGate({ children }: { children: ReactNode }) {
  const client = supabase!
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [membership, setMembership] = useState<Membership>('checking')

  useEffect(() => {
    void client.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => data.subscription.unsubscribe()
  }, [client])

  const userId = session?.user.id
  useEffect(() => {
    if (!userId) return
    let cancelled = false
    setMembership('checking')
    void client.rpc('is_member').then(({ data, error }) => {
      if (cancelled) return
      if (error) setMembership('error')
      else setMembership(data === true ? 'member' : 'outsider')
    })
    return () => {
      cancelled = true
    }
  }, [client, userId])

  const signOut = () => void client.auth.signOut()

  if (session === undefined) {
    return <div className="auth-screen" aria-busy="true" />
  }

  if (!session) return <LoginScreen />

  const email = session.user.email ?? ''

  if (membership === 'checking') {
    return <div className="auth-screen" aria-busy="true" />
  }

  if (membership !== 'member') {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h1>{membership === 'error' ? 'Algo falló' : 'Este correo no tiene acceso'}</h1>
          <p>
            {membership === 'error' ? (
              <>
                No se pudo comprobar el acceso. ¿Ya ejecutaste{' '}
                <code>supabase/schema.sql</code> en tu proyecto de Supabase?
              </>
            ) : (
              <>
                <strong>{email}</strong> no está en la lista de miembros. Añádelo a la
                tabla <code>members</code> en Supabase y vuelve a entrar.
              </>
            )}
          </p>
          <button type="button" className="button" onClick={signOut}>
            Usar otro correo
          </button>
        </div>
      </div>
    )
  }

  return (
    <AccountContext.Provider value={{ email, signOut }}>
      {children}
    </AccountContext.Provider>
  )
}

function LoginScreen() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const address = email.trim()
    if (!address || state === 'sending') return
    setState('sending')
    setError(null)
    const { error: failure } = await supabase!.auth.signInWithOtp({
      email: address,
      options: { emailRedirectTo: window.location.origin },
    })
    if (failure) {
      setError(loginErrorMessage(failure))
      setState('idle')
    } else {
      setState('sent')
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={submit}>
        <h1>Nuestros lugares</h1>
        {state === 'sent' ? (
          <>
            <p>
              Te enviamos un enlace a <strong>{email.trim()}</strong>. Ábrelo desde este
              mismo dispositivo para entrar.
            </p>
            <button type="button" className="button" onClick={() => setState('idle')}>
              Cambiar de correo
            </button>
          </>
        ) : (
          <>
            <p>Entra con tu correo: te llegará un enlace, sin contraseña.</p>
            <input
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
              required
              autoFocus
            />
            {error && <p className="auth-error">{error}</p>}
            <button
              type="submit"
              className="button button--primary button--block"
              disabled={state === 'sending'}
            >
              {state === 'sending' ? 'Enviando…' : 'Enviarme el enlace'}
            </button>
          </>
        )}
      </form>
    </div>
  )
}

/** Traduce los fallos más comunes del envío del enlace a algo accionable. */
function loginErrorMessage(failure: { message: string; status?: number }): string {
  const message = failure.message.toLowerCase()
  if (message.includes('fetch') || message.includes('network')) {
    return 'No se pudo conectar con Supabase. Revisa VITE_SUPABASE_URL en .env.local y reinicia npm run dev.'
  }
  if (failure.status === 401 || message.includes('api key')) {
    return 'Supabase rechazó la clave. Revisa VITE_SUPABASE_ANON_KEY en .env.local.'
  }
  if (failure.status === 429 || message.includes('rate limit')) {
    return 'Se enviaron demasiados enlaces seguidos. Espera unos minutos y vuelve a intentarlo.'
  }
  return failure.message
}
