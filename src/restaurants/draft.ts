import type { FoodCategory } from './food'
import type { PriceLevel } from './price'
import type { Restaurant, RestaurantStatus } from './types'

/** Valores del formulario de restaurante (todo string para los inputs). */
export type RestaurantDraft = {
  id?: string
  /** Origen en OpenStreetMap, si el punto salió de la capa de locales. */
  osmId?: string
  name: string
  status: RestaurantStatus
  address: string
  cuisine: string
  visitedAt: string
  notes: string
  message: string
  website: string
  /** null = deducirla del tipo de lugar. */
  foodCategory: FoodCategory | null
  priceLevel: PriceLevel | null
  lng: number
  lat: number
}

export function draftFromRestaurant(restaurant: Restaurant): RestaurantDraft {
  return {
    id: restaurant.id,
    osmId: restaurant.osmId,
    name: restaurant.name,
    status: restaurant.status,
    address: restaurant.address ?? '',
    cuisine: restaurant.cuisine ?? '',
    visitedAt: restaurant.visitedAt ?? '',
    notes: restaurant.notes ?? '',
    message: restaurant.message ?? '',
    website: restaurant.website ?? '',
    foodCategory: restaurant.foodCategory ?? null,
    priceLevel: restaurant.priceLevel ?? null,
    lng: restaurant.lng,
    lat: restaurant.lat,
  }
}

export function emptyDraft(
  lng: number,
  lat: number,
  values: Partial<RestaurantDraft> = {},
): RestaurantDraft {
  return {
    name: '',
    status: 'wishlist',
    address: '',
    cuisine: '',
    visitedAt: '',
    notes: '',
    message: '',
    website: '',
    foodCategory: null,
    priceLevel: null,
    lng,
    lat,
    ...values,
  }
}
