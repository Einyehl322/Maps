import type { FoodCategory } from './food'
import type { PriceLevel, Quote } from './price'

export type Dish = {
  id: string
  name: string
  /** 1 a 5 */
  rating: number
  notes?: string
  price?: number
  /** Clave de la foto en el almacén de imágenes */
  photoId?: string
  createdAt: string
}

/** `wishlist` = lugar al que queremos ir; `visited` = ya fuimos y podemos puntuar platos. */
export type RestaurantStatus = 'visited' | 'wishlist'

export type Restaurant = {
  id: string
  name: string
  status: RestaurantStatus
  address?: string
  cuisine?: string
  lng: number
  lat: number
  visitedAt?: string
  notes?: string
  /** Si vino de la guía de Lima, el id de la recomendación de origen. */
  recId?: string
  /** Si vino de la capa de OpenStreetMap, su identificador ("node/123"). */
  osmId?: string
  /** Fotos del lugar (no de un plato concreto), en orden de subida. */
  photoIds?: string[]
  /** Mensaje al marcarlo como "queremos ir" (💌) y de quién es. */
  message?: string
  messageFrom?: string
  /** Web, Instagram o carta del local, apuntado a mano. */
  website?: string
  /** ⭐ El próximo lugar al que piensan ir (solo uno a la vez). */
  isNext?: boolean
  /** Cuándo piensan ir (`yyyy-mm-dd`), si ya lo saben. */
  nextDate?: string
  /** Criollo, marino, norteño… elegido a mano; si falta, se deduce. */
  foodCategory?: FoodCategory
  /** Rango de precio por persona (ver `price.ts`). */
  priceLevel?: PriceLevel
  /** Cotización de una salida a este lugar. */
  quote?: Quote
  dishes: Dish[]
  createdAt: string
  updatedAt: string
}

/** Nota media del restaurante a partir de sus platos. `null` si aún no hay platos. */
export function averageRating(restaurant: Restaurant): number | null {
  if (!restaurant.dishes.length) return null
  const total = restaurant.dishes.reduce((sum, dish) => sum + dish.rating, 0)
  return total / restaurant.dishes.length
}

/** Color del pin según la nota, estilo semáforo. */
export function ratingColor(rating: number | null): string {
  if (rating === null) return '#5f6368'
  if (rating >= 4.5) return '#1e8e3e'
  if (rating >= 3.5) return '#188038'
  if (rating >= 2.5) return '#f9ab00'
  if (rating >= 1.5) return '#e8710a'
  return '#d93025'
}

export function newId(): string {
  return crypto.randomUUID()
}
