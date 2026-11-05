import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { MenuLookupsContext, type BulkState } from './menuLookupsContext'
import { MENU_SNAPSHOT } from './menuSnapshot'
import { menuKey, type MenuPrices, type MenuTarget } from './price'
import { store } from './storage'

/**
 * Cartas buscadas en internet, compartidas por la cotización y el presupuesto.
 * También lleva la "cotización masiva": buscar la carta de muchos lugares
 * seguidos, de a 3 a la vez, con progreso y botón de parar.
 */

const CONCURRENCY = 3

export function MenuLookupsProvider({ children }: { children: ReactNode }) {
  // Las cartas buscadas a mano sirven desde el principio; las de la nube mandan.
  const [lookups, setLookups] = useState<Record<string, MenuPrices>>(MENU_SNAPSHOT)
  const [ready, setReady] = useState(!store.canSearchPrices)
  const [bulk, setBulk] = useState<BulkState | null>(null)
  const stopRef = useRef(false)

  useEffect(() => {
    if (!store.canSearchPrices) return
    void store
      .loadMenuLookups()
      .then((cloud) => setLookups({ ...MENU_SNAPSHOT, ...cloud }))
      .catch(() => {})
      .finally(() => setReady(true))
  }, [])

  const search = useCallback(async (target: MenuTarget, force: boolean) => {
    const result = await store.searchMenu(target, force)
    setLookups((prev) => ({ ...prev, [menuKey(target)]: result }))
    return result
  }, [])

  const startBulk = useCallback(
    (targets: { target: MenuTarget; name: string }[]) => {
      if (!targets.length) return
      stopRef.current = false
      const queue = [...targets]
      setBulk({ total: targets.length, done: 0, failed: 0, current: [] })

      const worker = async () => {
        while (queue.length && !stopRef.current) {
          const next = queue.shift()!
          setBulk((prev) => prev && { ...prev, current: [...prev.current, next.name] })
          let ok = true
          try {
            await search(next.target, false)
          } catch {
            ok = false
          }
          setBulk(
            (prev) =>
              prev && {
                ...prev,
                done: prev.done + 1,
                failed: prev.failed + (ok ? 0 : 1),
                current: prev.current.filter((name) => name !== next.name),
              },
          )
        }
      }

      void Promise.all(Array.from({ length: CONCURRENCY }, worker)).then(() => {
        // Se deja el resumen a la vista hasta que lo cierren.
        setBulk((prev) => prev && { ...prev, current: [] })
      })
    },
    [search],
  )

  const stopBulk = useCallback(() => {
    stopRef.current = true
  }, [])

  const clearBulk = useCallback(() => setBulk(null), [])

  return (
    <MenuLookupsContext.Provider
      value={{
        enabled: store.canSearchPrices,
        lookups,
        ready,
        search,
        bulk,
        startBulk,
        stopBulk,
        clearBulk,
      }}
    >
      {children}
    </MenuLookupsContext.Provider>
  )
}
