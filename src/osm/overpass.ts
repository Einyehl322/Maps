import { toPlace, type OsmPlace, type OverpassElement } from './places'

/**
 * Cliente de la Overpass API (OpenStreetMap).
 *
 * Overpass es un servicio comunitario y gratuito: se usa con cabeza. La app
 * pide siempre trozos pequeños, cachea todo lo que baja (ver `cache.ts`) y
 * nunca lanza dos consultas a la vez.
 */

/** [oeste, sur, este, norte] */
export type Bbox = [number, number, number, number]

const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

const AMENITIES = 'restaurant|fast_food|cafe|bar|pub|ice_cream|food_court|biergarten'
const SHOPS = 'bakery|pastry|confectionery|deli'

/** Tope de resultados por consulta: evita reventar el mapa en zonas densas. */
const MAX_ELEMENTS = 5000

function buildQuery([west, south, east, north]: Bbox): string {
  const box = [south, west, north, east].map((n) => n.toFixed(6)).join(',')
  return [
    '[out:json][timeout:30];',
    '(',
    `nwr["amenity"~"^(${AMENITIES})$"](${box});`,
    `nwr["shop"~"^(${SHOPS})$"](${box});`,
    ');',
    // `tags center` evita que los polígonos se traigan su lista de nodos.
    `out tags center ${MAX_ELEMENTS};`,
  ].join('\n')
}

/** Se rota el espejo de arranque para no cargar siempre sobre el mismo. */
let mirrorOffset = 0

export class OverpassError extends Error {}

export async function fetchPlacesInBbox(
  bbox: Bbox,
  signal?: AbortSignal,
): Promise<OsmPlace[]> {
  const body = new URLSearchParams({ data: buildQuery(bbox) })
  let lastError: unknown = null

  for (let attempt = 0; attempt < MIRRORS.length; attempt += 1) {
    const url = MIRRORS[(mirrorOffset + attempt) % MIRRORS.length]

    try {
      const response = await fetch(url, {
        method: 'POST',
        body,
        signal,
        headers: { Accept: 'application/json' },
      })

      // 429 y 504 son "estoy saturado": toca probar otro espejo.
      if (!response.ok) throw new OverpassError(`HTTP ${response.status}`)

      const data: { elements?: OverpassElement[] } = await response.json()
      if (!Array.isArray(data.elements)) throw new OverpassError('Respuesta inesperada')

      // El espejo que ha respondido pasa a ser el primero de la próxima vez.
      mirrorOffset = (mirrorOffset + attempt) % MIRRORS.length

      const places: OsmPlace[] = []
      for (const element of data.elements) {
        const place = toPlace(element)
        if (place) places.push(place)
      }
      return places
    } catch (error) {
      if (signal?.aborted) throw error
      lastError = error
    }
  }

  throw new OverpassError(
    `No se pudo consultar OpenStreetMap: ${String(lastError ?? 'sin respuesta')}`,
  )
}
