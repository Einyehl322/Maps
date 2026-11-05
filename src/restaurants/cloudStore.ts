import type { SupabaseClient } from '@supabase/supabase-js'
import { PHOTO_BUCKET } from '../lib/supabase'
import {
  isPriceLevel,
  parseMenuPrices,
  parseQuote,
  type MenuPrices,
  type MenuTarget,
  type Quote,
} from './price'
import { parseActivity, type Activity } from './activity'
import { isFoodCategory } from './food'
import type { Dish, Restaurant } from './types'

/**
 * Persistencia en Supabase: tabla `places`, tabla `dishes` y el bucket de fotos.
 * El esquema está en `supabase/schema.sql`.
 */

type PlaceRow = {
  id: string
  name: string
  status: Restaurant['status']
  address: string | null
  cuisine: string | null
  lng: number
  lat: number
  visited_at: string | null
  notes: string | null
  rec_id: string | null
  osm_id: string | null
  photo_ids: string[]
  price_level: number | null
  quote: Quote | null
  website: string | null
  message: string | null
  message_from: string | null
  food_category: string | null
  is_next: boolean
  next_date: string | null
  created_at: string
  updated_at: string
}

type DishRow = {
  id: string
  place_id: string
  name: string
  rating: number
  notes: string | null
  price: number | string | null
  photo_id: string | null
  created_at: string
}

function toRestaurant(row: PlaceRow & { dishes: DishRow[] }): Restaurant {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    address: row.address ?? undefined,
    cuisine: row.cuisine ?? undefined,
    lng: row.lng,
    lat: row.lat,
    visitedAt: row.visited_at ?? undefined,
    notes: row.notes ?? undefined,
    recId: row.rec_id ?? undefined,
    osmId: row.osm_id ?? undefined,
    photoIds: row.photo_ids ?? [],
    priceLevel: isPriceLevel(row.price_level) ? row.price_level : undefined,
    quote: parseQuote(row.quote),
    website: row.website ?? undefined,
    message: row.message ?? undefined,
    messageFrom: row.message_from ?? undefined,
    foodCategory: isFoodCategory(row.food_category) ? row.food_category : undefined,
    isNext: row.is_next === true || undefined,
    nextDate: row.next_date ?? undefined,
    dishes: [...row.dishes]
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map(
        (dish): Dish => ({
          id: dish.id,
          name: dish.name,
          rating: dish.rating,
          notes: dish.notes ?? undefined,
          // `numeric` llega como string desde PostgREST.
          price: dish.price == null ? undefined : Number(dish.price),
          photoId: dish.photo_id ?? undefined,
          createdAt: dish.created_at,
        }),
      ),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toPlaceRow(restaurant: Restaurant): PlaceRow {
  return {
    id: restaurant.id,
    name: restaurant.name,
    status: restaurant.status,
    address: restaurant.address ?? null,
    cuisine: restaurant.cuisine ?? null,
    lng: restaurant.lng,
    lat: restaurant.lat,
    visited_at: restaurant.visitedAt ?? null,
    notes: restaurant.notes ?? null,
    rec_id: restaurant.recId ?? null,
    osm_id: restaurant.osmId ?? null,
    photo_ids: restaurant.photoIds ?? [],
    price_level: restaurant.priceLevel ?? null,
    quote: restaurant.quote ?? null,
    website: restaurant.website ?? null,
    message: restaurant.message ?? null,
    message_from: restaurant.messageFrom ?? null,
    food_category: restaurant.foodCategory ?? null,
    is_next: restaurant.isNext === true,
    next_date: restaurant.nextDate ?? null,
    created_at: restaurant.createdAt,
    updated_at: restaurant.updatedAt,
  }
}

function toDishRow(placeId: string, dish: Dish): DishRow {
  return {
    id: dish.id,
    place_id: placeId,
    name: dish.name,
    rating: dish.rating,
    notes: dish.notes ?? null,
    price: dish.price ?? null,
    photo_id: dish.photoId ?? null,
    created_at: dish.createdAt,
  }
}

export function createCloudStore(client: SupabaseClient) {
  return {
    async loadRestaurants(): Promise<Restaurant[]> {
      const { data, error } = await client
        .from('places')
        .select('*, dishes(*)')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return (data as (PlaceRow & { dishes: DishRow[] })[]).map(toRestaurant)
    },

    /** Guarda el lugar y deja sus platos exactamente como vienen. */
    async saveRestaurant(restaurant: Restaurant): Promise<void> {
      const { error } = await client.rpc('save_place', {
        place: toPlaceRow(restaurant),
        dish_rows: restaurant.dishes.map((dish) => toDishRow(restaurant.id, dish)),
      })
      if (error) throw error
    },

    async deleteRestaurant(id: string): Promise<void> {
      // Los platos se borran en cascada.
      const { error } = await client.from('places').delete().eq('id', id)
      if (error) throw error
    },

    async savePhoto(id: string, blob: Blob): Promise<void> {
      const { error } = await client.storage
        .from(PHOTO_BUCKET)
        .upload(id, blob, { contentType: blob.type || 'image/webp', upsert: true })
      if (error) throw error
    },

    /** URL firmada válida una hora: el bucket es privado. */
    async photoUrl(id: string): Promise<string | null> {
      const { data, error } = await client.storage
        .from(PHOTO_BUCKET)
        .createSignedUrl(id, 60 * 60)
      if (error) return null
      return data.signedUrl
    },

    /** Ids fijos + `ignoreDuplicates`: reenviar una entrada no la duplica. */
    async saveActivity(events: Activity[]): Promise<void> {
      if (!events.length) return
      const { error } = await client.from('activity').upsert(
        events.map((event) => ({
          id: event.id,
          kind: event.kind,
          place_id: event.placeId ?? null,
          place_name: event.placeName,
          detail: event.detail,
          actor: event.actor ?? null,
          created_at: event.at,
        })),
        { onConflict: 'id', ignoreDuplicates: true },
      )
      if (error) throw error
    },

    async loadActivity(): Promise<Activity[]> {
      const { data, error } = await client
        .from('activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000)
      if (error) throw error
      return (data ?? [])
        .map((row) =>
          parseActivity({
            id: row.id,
            kind: row.kind,
            placeId: row.place_id ?? undefined,
            placeName: row.place_name,
            detail: row.detail,
            actor: row.actor ?? undefined,
            at: row.created_at,
          }),
        )
        .filter((item): item is Activity => item !== null)
    },

    /** Todas las cartas ya buscadas (de lugares guardados y de la guía), por clave. */
    async loadMenuLookups(): Promise<Record<string, MenuPrices>> {
      const { data, error } = await client.from('menu_lookups').select('*')
      if (error) throw error
      const result: Record<string, MenuPrices> = {}
      for (const row of data ?? []) {
        const parsed = parseMenuPrices(row)
        if (parsed) result[parsed.key] = parsed
      }
      return result
    },

    /** Busca la carta en internet (función `price-search`). Tarda ~1 minuto. */
    async searchMenu(target: MenuTarget, force: boolean): Promise<MenuPrices> {
      const { data, error } = await client.functions.invoke('price-search', {
        body: { ...target, force },
      })
      if (error) {
        // El cuerpo del error trae el mensaje de la función, en español.
        let message = error.message
        try {
          const body = await (error.context as Response).json()
          if (typeof body?.error === 'string') message = body.error
        } catch {
          // Sin cuerpo legible: se queda el mensaje genérico.
        }
        throw new Error(message)
      }
      const parsed = parseMenuPrices(data)
      if (!parsed) throw new Error('Respuesta inesperada del buscador de precios')
      return parsed
    },

    /** Nombres de los miembros para el diario ("Ana subió 3 fotos"). */
    async memberNames(): Promise<Record<string, string>> {
      const { data, error } = await client.rpc('member_names')
      if (error) return {}
      return Object.fromEntries(
        ((data ?? []) as { email: string; name: string | null }[])
          .filter((row) => row.name)
          .map((row) => [row.email, row.name!]),
      )
    },

    async deletePhotos(ids: string[]): Promise<void> {
      if (!ids.length) return
      const { error } = await client.storage.from(PHOTO_BUCKET).remove(ids)
      if (error) throw error
    },
  }
}
