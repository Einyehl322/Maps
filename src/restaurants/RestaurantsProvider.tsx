import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useAccount } from '../auth/accountContext'
import { isCloud, supabase } from '../lib/supabase'
import {
  backfill,
  diffPlace,
  dishAdded,
  photosAdded,
  placeRemoved,
  type Activity,
} from './activity'
import { DEMO_RESTAURANTS } from './demo'
import { removePhotos, storePhoto } from './photos'
import { RestaurantsContext, type RestaurantsValue } from './restaurantsContext'
import { store } from './storage'
import type { Dish, Restaurant } from './types'

function sortByUpdated(list: Restaurant[]): Restaurant[] {
  return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

function describe(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return 'Error desconocido'
}

/**
 * Avisar por correo a la otra persona: lugar nuevo en "queremos ir", uno que
 * pasa a "queremos ir", o un mensaje nuevo en uno que ya lo estaba.
 */
function shouldNotify(previous: Restaurant | undefined, saved: Restaurant): boolean {
  if (saved.status !== 'wishlist') return false
  if (!previous || previous.status !== 'wishlist') return true
  return Boolean(saved.message) && saved.message !== previous.message
}

/** El diario nunca bloquea ni hace fallar la acción principal. */
function log(events: Activity[]) {
  if (!events.length) return
  void store.saveActivity(events).catch((err: unknown) => {
    console.warn('[diario] no se pudo apuntar:', err)
  })
}

/** Lo envía la función `notify-wish` de Supabase. Si falla, el lugar ya está guardado. */
function notifyWish(placeId: string) {
  if (!supabase) return
  void supabase.functions
    .invoke('notify-wish', { body: { placeId } })
    .then(({ error }) => {
      if (error) console.warn('[notify-wish] no se pudo avisar por correo:', error.message)
    })
}

export function RestaurantsProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const actor = useAccount()?.email
  const actorRef = useRef(actor)
  actorRef.current = actor

  // Las acciones leen siempre la lista más reciente, aunque se encadenen.
  const latestRef = useRef(restaurants)
  latestRef.current = restaurants
  const find = (id: string) => latestRef.current.find((item) => item.id === id)

  const reload = useCallback(async () => {
    try {
      const list = await store.loadRestaurants()
      setRestaurants(sortByUpdated(list))
      setError(null)
    } catch (err) {
      setError(`No se pudieron cargar los lugares: ${describe(err)}`)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    void reload()
    if (!isCloud) return

    // Lo que añada la otra persona aparece al volver a la pestaña o la app.
    const onVisible = () => {
      if (document.visibilityState === 'visible') void reload()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [reload])

  const persist = useCallback(async (restaurant: Restaurant) => {
    try {
      await store.saveRestaurant(restaurant)
      setError(null)
    } catch (err) {
      setError(`No se pudo guardar "${restaurant.name}": ${describe(err)}`)
      throw err
    }
    setRestaurants((prev) => {
      const rest = prev.filter((item) => item.id !== restaurant.id)
      return sortByUpdated([...rest, restaurant])
    })
  }, [])

  const upsertRestaurant: RestaurantsValue['upsertRestaurant'] = useCallback(
    async (input) => {
      const now = new Date().toISOString()
      const previous = find(input.id)
      // Lo que el llamador no manda (recId, fotos, cotización…) se conserva;
      // lo que manda, aunque sea `undefined`, sobrescribe.
      const saved: Restaurant = {
        ...previous,
        ...input,
        dishes: input.dishes ?? previous?.dishes ?? [],
        photoIds: input.photoIds ?? previous?.photoIds ?? [],
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
      }
      await persist(saved)
      log(diffPlace(previous, saved, actorRef.current))
      if (shouldNotify(previous, saved)) notifyWish(saved.id)
      return saved
    },
    [persist],
  )

  const removeRestaurant = useCallback(async (id: string) => {
    const target = find(id)
    try {
      await store.deleteRestaurant(id)
    } catch (err) {
      setError(`No se pudo borrar: ${describe(err)}`)
      throw err
    }
    // Sus fotos dejarían de tener dueño: las borramos también.
    await removePhotos([
      ...(target?.photoIds ?? []),
      ...(target?.dishes ?? []).map((dish) => dish.photoId),
    ])
    if (target) log([placeRemoved(target, actorRef.current)])
    setRestaurants((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const upsertDish = useCallback(
    async (restaurantId: string, dish: Dish) => {
      const target = find(restaurantId)
      if (!target) return
      const index = target.dishes.findIndex((item) => item.id === dish.id)
      const dishes =
        index === -1
          ? [...target.dishes, dish]
          : target.dishes.map((item) => (item.id === dish.id ? dish : item))
      // Añadir un plato implica que ya fuimos.
      const saved: Restaurant = {
        ...target,
        status: 'visited',
        dishes,
        updatedAt: new Date().toISOString(),
      }
      await persist(saved)
      log([
        ...diffPlace(target, saved, actorRef.current),
        ...(index === -1 ? [dishAdded(saved, dish, actorRef.current)] : []),
      ])
    },
    [persist],
  )

  const removeDish = useCallback(
    async (restaurantId: string, dishId: string) => {
      const target = find(restaurantId)
      if (!target) return
      const dish = target.dishes.find((item) => item.id === dishId)
      await persist({
        ...target,
        dishes: target.dishes.filter((item) => item.id !== dishId),
        updatedAt: new Date().toISOString(),
      })
      await removePhotos([dish?.photoId])
    },
    [persist],
  )

  const addPhotos = useCallback(
    async (restaurantId: string, files: File[]) => {
      if (!files.length) return
      let uploaded: string[]
      try {
        uploaded = await Promise.all(files.map((file) => storePhoto(file)))
      } catch (err) {
        setError(`No se pudieron subir las fotos: ${describe(err)}`)
        throw err
      }
      const target = find(restaurantId)
      if (!target) return
      const saved: Restaurant = {
        ...target,
        photoIds: [...(target.photoIds ?? []), ...uploaded],
        updatedAt: new Date().toISOString(),
      }
      await persist(saved)
      log([photosAdded(saved, uploaded, actorRef.current)])
    },
    [persist],
  )

  const removePhoto = useCallback(
    async (restaurantId: string, photoId: string) => {
      const target = find(restaurantId)
      if (!target) return
      await persist({
        ...target,
        photoIds: (target.photoIds ?? []).filter((id) => id !== photoId),
        updatedAt: new Date().toISOString(),
      })
      await removePhotos([photoId])
    },
    [persist],
  )

  const loadDemo = useCallback(async () => {
    const created = DEMO_RESTAURANTS()
    try {
      await Promise.all(created.map((item) => store.saveRestaurant(item)))
    } catch (err) {
      setError(`No se pudieron guardar los ejemplos: ${describe(err)}`)
      throw err
    }
    log(backfill(created))
    setRestaurants((prev) => sortByUpdated([...prev, ...created]))
    return created
  }, [])

  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        ready,
        error,
        upsertRestaurant,
        removeRestaurant,
        upsertDish,
        removeDish,
        addPhotos,
        removePhoto,
        loadDemo,
      }}
    >
      {children}
    </RestaurantsContext.Provider>
  )
}
