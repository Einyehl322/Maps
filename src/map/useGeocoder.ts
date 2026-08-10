import { useEffect, useState } from 'react'
import type { Map as MapLibreMap } from 'maplibre-gl'

export type GeoResult = {
  id: string
  /** Nombre corto: "Casa Botín" */
  name: string
  /** Resto de la dirección: "Calle de Cuchilleros, Madrid, España" */
  detail: string
  center: [number, number]
  /** [oeste, sur, este, norte] */
  bbox?: [number, number, number, number]
  category?: string
}

type NominatimItem = {
  place_id: number
  name?: string
  display_name: string
  lat: string
  lon: string
  boundingbox?: [string, string, string, string]
  category?: string
  type?: string
}

const ENDPOINT = 'https://nominatim.openstreetmap.org/search'
const REVERSE_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse'
const DEBOUNCE_MS = 350
const MIN_LENGTH = 3

/**
 * Tipos de OSM que son "un sitio donde comer o beber". Se usan para subir los
 * locales por delante de calles y barrios: buscar "canta rana" debe dar el
 * restaurante, no una avenida que se llame parecido.
 */
const FOOD_TYPES = new Set([
  'restaurant',
  'fast_food',
  'cafe',
  'bar',
  'pub',
  'bakery',
  'ice_cream',
  'confectionery',
  'deli',
  'food_court',
  'biergarten',
  'marketplace',
])

function isFood(item: NominatimItem): boolean {
  return (
    FOOD_TYPES.has(item.type ?? '') ||
    item.category === 'amenity' ||
    item.category === 'shop'
  )
}

function toResult(item: NominatimItem): GeoResult | null {
  const lon = Number.parseFloat(item.lon)
  const lat = Number.parseFloat(item.lat)
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null

  const parts = item.display_name.split(', ')
  const name = item.name?.trim() || parts[0]
  const detail = (item.name?.trim() ? parts : parts.slice(1)).join(', ')

  let bbox: GeoResult['bbox']
  if (item.boundingbox) {
    const [south, north, west, east] = item.boundingbox.map(Number.parseFloat)
    if ([south, north, west, east].every(Number.isFinite)) {
      bbox = [west, south, east, north]
    }
  }

  return {
    id: String(item.place_id),
    name,
    detail,
    center: [lon, lat],
    bbox,
    category: item.type ?? item.category,
  }
}

/**
 * Qué hay en unas coordenadas: sirve para rellenar nombre y dirección
 * cuando marcas un sitio pinchando en el mapa.
 */
export async function reverseGeocode(
  lng: number,
  lat: number,
): Promise<{ name?: string; address?: string } | null> {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lon: String(lng),
    lat: String(lat),
    zoom: '18',
    'accept-language': navigator.language || 'es',
  })

  try {
    const response = await fetch(`${REVERSE_ENDPOINT}?${params}`, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return null
    const item: NominatimItem & { error?: string } = await response.json()
    if (item.error || !item.display_name) return null

    const parts = item.display_name.split(', ')
    const name = item.name?.trim()
    return {
      name: name || undefined,
      address: (name ? parts : parts.slice(0, 4)).slice(0, 4).join(', '),
    }
  } catch {
    return null
  }
}

/**
 * Búsqueda de lugares con Nominatim (OpenStreetMap): sin API key.
 * Los resultados se sesgan hacia la vista actual del mapa.
 */
export function useGeocoder(query: string, map: MapLibreMap | null) {
  const [results, setResults] = useState<GeoResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const term = query.trim()
    if (term.length < MIN_LENGTH) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    setLoading(true)

    const timer = setTimeout(async () => {
      const params = new URLSearchParams({
        format: 'jsonv2',
        q: term,
        limit: '12',
        addressdetails: '0',
        // La app vive en Lima: sin esto "la mar" devuelve medio mundo.
        countrycodes: 'pe',
        'accept-language': navigator.language || 'es',
      })

      // Priorizar lo que hay a la vista, sin excluir el resto del país.
      if (map) {
        const b = map.getBounds()
        params.set(
          'viewbox',
          [b.getWest(), b.getNorth(), b.getEast(), b.getSouth()]
            .map((n) => n.toFixed(5))
            .join(','),
        )
      }

      try {
        const response = await fetch(`${ENDPOINT}?${params}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data: NominatimItem[] = await response.json()
        // Locales primero, respetando el orden de relevancia dentro de cada grupo.
        const ranked = [...data.filter(isFood), ...data.filter((item) => !isFood(item))]
        setResults(
          ranked
            .map(toResult)
            .filter((r): r is GeoResult => r !== null)
            .slice(0, 6),
        )
        setError(null)
      } catch (err) {
        if (controller.signal.aborted) return
        setResults([])
        setError('No se pudo buscar. Revisa tu conexión.')
        void err
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, map])

  return { results, loading, error }
}
