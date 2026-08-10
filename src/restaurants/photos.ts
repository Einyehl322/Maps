import { useEffect, useState } from 'react'
import { loadPhoto, savePhoto } from './storage'
import { newId } from './types'

const MAX_SIDE = 1400
const QUALITY = 0.82

/**
 * Redimensiona la foto antes de guardarla: las fotos de móvil pesan varios MB
 * y en el navegador no hay espacio infinito.
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
  await savePhoto(id, await shrink(file))
  return id
}

/** URL temporal para mostrar una foto guardada. Se libera al desmontar. */
export function usePhotoUrl(photoId: string | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!photoId) {
      setUrl(null)
      return
    }

    let cancelled = false
    let objectUrl: string | null = null

    void loadPhoto(photoId).then((blob) => {
      if (cancelled || !blob) return
      objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
    })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setUrl(null)
    }
  }, [photoId])

  return url
}
