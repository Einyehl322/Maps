import { createContext, useContext } from 'react'
import type { Dish, Restaurant } from './types'

export type RestaurantsValue = {
  restaurants: Restaurant[]
  ready: boolean
  /** Crea o actualiza un restaurante y devuelve el guardado. */
  upsertRestaurant: (
    restaurant: Omit<Restaurant, 'createdAt' | 'updatedAt' | 'dishes' | 'photoIds'> &
      Partial<Pick<Restaurant, 'dishes' | 'photoIds'>>,
  ) => Promise<Restaurant>
  removeRestaurant: (id: string) => Promise<void>
  upsertDish: (restaurantId: string, dish: Dish) => Promise<void>
  removeDish: (restaurantId: string, dishId: string) => Promise<void>
  /** Sube fotos del lugar (no de un plato). */
  addPhotos: (restaurantId: string, files: File[]) => Promise<void>
  removePhoto: (restaurantId: string, photoId: string) => Promise<void>
  /** ⭐ Marca (o quita, con `null`) el próximo destino. Solo hay uno. */
  setNextDestination: (id: string | null, date?: string) => Promise<void>
  /** Error de carga o guardado, para mostrarlo en pantalla. */
  error: string | null
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
