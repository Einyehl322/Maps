import { useEffect, useState } from 'react'
import { isCloud } from '../lib/supabase'
import { store, type PhotoHandle } from './storage'
import { newId } from './types'

const MAX_SIDE = 1600
const QUALITY = 0.82

/**
 * Redimensiona la foto antes de guardarla: las fotos de móvil pesan varios MB
 * y así se suben rápido y ocupan poco.
 */
async function shrink(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return file
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', QUALITY)
    })
    return blob ?? file
  } catch {
    // Formato que el navegador no sabe decodificar: guardamos el original.
    return file
  }
}

/** Guarda una foto y devuelve su identificador. */
export async function storePhoto(file: File): Promise<string> {
  const id = newId()
  await store.savePhoto(id, await shrink(file))
  return id
}

/**
 * Caché de URLs: el pin, la lista y la galería piden la misma foto y así
 * solo se resuelve una vez. En Supabase la URL firmada dura una hora, así que
 * se renueva antes de que caduque.
 */
const TTL = 45 * 60 * 1000
const cache = new Map<string, { handle: Promise<PhotoHandle | null>; at: number }>()

export function photoUrl(id: string): Promise<string | null> {
  const hit = cache.get(id)
  // En local la URL es un blob: que no caduca; solo las firmadas se renuevan.
  if (hit && (!isCloud || Date.now() - hit.at < TTL)) {
    return hit.handle.then((h) => h?.url ?? null)
  }
  const handle = store.photoUrl(id).catch(() => null)
  cache.set(id, { handle, at: Date.now() })
  return handle.then((h) => h?.url ?? null)
}

function evict(id: string) {
  const hit = cache.get(id)
  if (!hit) return
  cache.delete(id)
  void hit.handle.then((h) => h?.release())
}

export async function removePhotos(ids: (string | undefined)[]): Promise<void> {
  const present = ids.filter((id): id is string => Boolean(id))
  if (!present.length) return
  present.forEach(evict)
  try {
    await store.deletePhotos(present)
  } catch {
    // Una foto huérfana no debe impedir borrar lo demás.
  }
}

/** URL para mostrar una foto guardada (o `null` mientras carga). */
export function usePhotoUrl(photoId: string | undefined): string | null {
  const [state, setState] = useState<{ id: string; url: string } | null>(null)

  useEffect(() => {
    if (!photoId) return
    let cancelled = false
    void photoUrl(photoId).then((url) => {
      if (!cancelled && url) setState({ id: photoId, url })
    })
    return () => {
      cancelled = true
    }
  }, [photoId])

  return state && state.id === photoId ? state.url : null
}
