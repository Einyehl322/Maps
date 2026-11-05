import { byNewest, parseActivity, type Activity } from './activity'
import type { Restaurant } from './types'

/**
 * Persistencia en IndexedDB: los restaurantes en un almacén y las fotos
 * (Blobs, demasiado grandes para localStorage) en otro.
 */

const DB_NAME = 'mis-restaurantes'
const DB_VERSION = 2
const RESTAURANTS = 'restaurants'
const PHOTOS = 'photos'
const ACTIVITY = 'activity'

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(RESTAURANTS)) {
        db.createObjectStore(RESTAURANTS, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(PHOTOS)) {
        db.createObjectStore(PHOTOS)
      }
      // Versión 2: el diario.
      if (!db.objectStoreNames.contains(ACTIVITY)) {
        db.createObjectStore(ACTIVITY, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return dbPromise
}

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withStore<T>(
  store: string,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb()
  const transaction = db.transaction(store, mode)
  const result = await promisify(run(transaction.objectStore(store)))
  return result
}

export async function loadRestaurants(): Promise<Restaurant[]> {
  const all = await withStore<Restaurant[]>(RESTAURANTS, 'readonly', (store) =>
    store.getAll(),
  )
  return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function saveRestaurant(restaurant: Restaurant): Promise<void> {
  await withStore(RESTAURANTS, 'readwrite', (store) => store.put(restaurant))
}

export async function deleteRestaurant(id: string): Promise<void> {
  await withStore(RESTAURANTS, 'readwrite', (store) => store.delete(id))
}

export async function savePhoto(id: string, blob: Blob): Promise<void> {
  await withStore(PHOTOS, 'readwrite', (store) => store.put(blob, id))
}

export async function loadPhoto(id: string): Promise<Blob | undefined> {
  return withStore<Blob | undefined>(PHOTOS, 'readonly', (store) => store.get(id))
}

export async function deletePhoto(id: string): Promise<void> {
  await withStore(PHOTOS, 'readwrite', (store) => store.delete(id))
}

export async function saveActivity(events: Activity[]): Promise<void> {
  if (!events.length) return
  const db = await openDb()
  const transaction = db.transaction(ACTIVITY, 'readwrite')
  const store = transaction.objectStore(ACTIVITY)
  for (const event of events) store.put(event)
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

export async function loadActivity(): Promise<Activity[]> {
  const all = await withStore<unknown[]>(ACTIVITY, 'readonly', (store) => store.getAll())
  return all
    .map(parseActivity)
    .filter((item): item is Activity => item !== null)
    .sort(byNewest)
}
