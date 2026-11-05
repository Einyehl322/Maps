import { supabase } from '../lib/supabase'
import { createCloudStore } from './cloudStore'
import * as local from './localStore'
import type { Activity } from './activity'
import type { Restaurant } from './types'

/**
 * Punto único de persistencia. Con Supabase configurado todo va a la nube
 * (compartido entre los dos); sin él, a IndexedDB en este navegador.
 */

export type PhotoHandle = { url: string; release: () => void }

type Store = {
  loadRestaurants: () => Promise<Restaurant[]>
  saveRestaurant: (restaurant: Restaurant) => Promise<void>
  deleteRestaurant: (id: string) => Promise<void>
  savePhoto: (id: string, blob: Blob) => Promise<void>
  deletePhotos: (ids: string[]) => Promise<void>
  photoUrl: (id: string) => Promise<PhotoHandle | null>
  saveActivity: (events: Activity[]) => Promise<void>
  loadActivity: () => Promise<Activity[]>
  memberNames: () => Promise<Record<string, string>>
}

const localStore: Store = {
  loadRestaurants: local.loadRestaurants,
  saveRestaurant: local.saveRestaurant,
  deleteRestaurant: local.deleteRestaurant,
  savePhoto: local.savePhoto,
  saveActivity: local.saveActivity,
  loadActivity: local.loadActivity,
  memberNames: async () => ({}),
  deletePhotos: async (ids) => {
    await Promise.all(ids.map((id) => local.deletePhoto(id)))
  },
  photoUrl: async (id) => {
    const blob = await local.loadPhoto(id)
    if (!blob) return null
    const url = URL.createObjectURL(blob)
    return { url, release: () => URL.revokeObjectURL(url) }
  },
}

function cloudStore(): Store {
  const cloud = createCloudStore(supabase!)
  return {
    ...cloud,
    photoUrl: async (id) => {
      const url = await cloud.photoUrl(id)
      return url ? { url, release: () => {} } : null
    },
  }
}

export const store: Store = supabase ? cloudStore() : localStore
