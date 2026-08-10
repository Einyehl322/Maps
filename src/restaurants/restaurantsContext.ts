import { createContext, useContext } from 'react'
import type { Dish, Restaurant } from './types'

export type RestaurantsValue = {
  restaurants: Restaurant[]
  ready: boolean
  /** Crea o actualiza un restaurante y devuelve el guardado. */
  upsertRestaurant: (
    restaurant: Omit<Restaurant, 'createdAt' | 'updatedAt' | 'dishes'> &
      Partial<Pick<Restaurant, 'dishes'>>,
  ) => Promise<Restaurant>
  removeRestaurant: (id: string) => Promise<void>
  upsertDish: (restaurantId: string, dish: Dish) => Promise<void>
  removeDish: (restaurantId: string, dishId: string) => Promise<void>
  loadDemo: () => Promise<Restaurant[]>
}

export const RestaurantsContext = createContext<RestaurantsValue | null>(null)

export function useRestaurants(): RestaurantsValue {
  const ctx = useContext(RestaurantsContext)
  if (!ctx) {
    throw new Error('useRestaurants() debe usarse dentro de <RestaurantsProvider>')
  }
  return ctx
}
