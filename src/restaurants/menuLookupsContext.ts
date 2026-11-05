import { createContext, useContext } from 'react'
import type { MenuPrices, MenuTarget } from './price'

export type BulkState = {
  total: number
  done: number
  failed: number
  /** Nombre de lo que se está buscando ahora. */
  current: string[]
}

export type MenuLookupsValue = {
  enabled: boolean
  lookups: Record<string, MenuPrices>
  ready: boolean
  search: (target: MenuTarget, force: boolean) => Promise<MenuPrices>
  bulk: BulkState | null
  startBulk: (targets: { target: MenuTarget; name: string }[]) => void
  stopBulk: () => void
  /** Cierra el resumen de la cotización masiva cuando ya terminó. */
  clearBulk: () => void
}

export const MenuLookupsContext = createContext<MenuLookupsValue | null>(null)

export function useMenuLookups(): MenuLookupsValue {
  const ctx = useContext(MenuLookupsContext)
  if (!ctx) throw new Error('useMenuLookups() debe usarse dentro de <MenuLookupsProvider>')
  return ctx
}
