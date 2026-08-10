import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { DEMO_RESTAURANTS } from './demo'
import { RestaurantsContext, type RestaurantsValue } from './restaurantsContext'
import * as db from './storage'
import type { Dish, Restaurant } from './types'

function sortByUpdated(list: Restaurant[]): Restaurant[] {
  return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function RestaurantsProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void db
      .loadRestaurants()
      .then((list) => {
        if (!cancelled) setRestaurants(list)
      })
      .catch(() => {
        // Sin IndexedDB (modo privado antiguo) la app sigue en memoria.
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback(async (restaurant: Restaurant) => {
    await db.saveRestaurant(restaurant)
    setRestaurants((prev) => {
      const rest = prev.filter((item) => item.id !== restaurant.id)
      return sortByUpdated([...rest, restaurant])
    })
  }, [])

  const upsertRestaurant: RestaurantsValue['upsertRestaurant'] = useCallback(
    async (input) => {
      const now = new Date().toISOString()
      const previous = restaurants.find((item) => item.id === input.id)
      const saved: Restaurant = {
        ...input,
        dishes: input.dishes ?? previous?.dishes ?? [],
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
      }
      await persist(saved)
      return saved
    },
    [persist, restaurants],
  )

  const removeRestaurant = useCallback(
    async (id: string) => {
      const target = restaurants.find((item) => item.id === id)
      await db.deleteRestaurant(id)
      // Las fotos de sus platos dejarían de tener dueño: las borramos también.
      await Promise.all(
        (target?.dishes ?? [])
          .map((dish) => dish.photoId)
          .filter((photoId): photoId is string => Boolean(photoId))
          .map((photoId) => db.deletePhoto(photoId)),
      )
      setRestaurants((prev) => prev.filter((item) => item.id !== id))
    },
    [restaurants],
  )

  const upsertDish = useCallback(
    async (restaurantId: string, dish: Dish) => {
      const target = restaurants.find((item) => item.id === restaurantId)
      if (!target) return
      const index = target.dishes.findIndex((item) => item.id === dish.id)
      const dishes =
        index === -1
          ? [...target.dishes, dish]
          : target.dishes.map((item) => (item.id === dish.id ? dish : item))
      // Añadir un plato implica que ya has ido.
      await persist({
        ...target,
        status: 'visited',
        dishes,
        updatedAt: new Date().toISOString(),
      })
    },
    [persist, restaurants],
  )

  const removeDish = useCallback(
    async (restaurantId: string, dishId: string) => {
      const target = restaurants.find((item) => item.id === restaurantId)
      if (!target) return
      const dish = target.dishes.find((item) => item.id === dishId)
      if (dish?.photoId) await db.deletePhoto(dish.photoId)
      await persist({
        ...target,
        dishes: target.dishes.filter((item) => item.id !== dishId),
        updatedAt: new Date().toISOString(),
      })
    },
    [persist, restaurants],
  )

  const loadDemo = useCallback(async () => {
    const created = DEMO_RESTAURANTS()
    await Promise.all(created.map((item) => db.saveRestaurant(item)))
    setRestaurants((prev) => sortByUpdated([...prev, ...created]))
    return created
  }, [])

  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        ready,
        upsertRestaurant,
        removeRestaurant,
        upsertDish,
        removeDish,
        loadDemo,
      }}
    >
      {children}
    </RestaurantsContext.Provider>
  )
}
