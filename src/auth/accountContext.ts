import { createContext, useContext } from 'react'

export type Account = { email: string; signOut: () => void }

/** `null` en modo local: no hay sesión. */
export const AccountContext = createContext<Account | null>(null)

export function useAccount(): Account | null {
  return useContext(AccountContext)
}
