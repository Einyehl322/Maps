import type { GeoResult } from './useGeocoder'

/**
 * Búsqueda de locales de comida por nombre con Photon (OpenStreetMap, sin key).
 *
 * Nominatim no siempre los encuentra ("Museo Larco" da el museo, no su
 * restaurante); Photon está hecho para buscar mientras escribes y deja
 * filtrar por tipo de local.
 */

const ENDPOINT = 'https://photon.komoot.io/api/'

/** Lima Metropolitana y Callao, de Ancón a Pucusana: oeste, sur, este, norte. */
const LIMA_BBOX = '-77.25,-12.55,-76.6,-11.7'

const FOOD_TAGS = [
  'amenity:restaurant',
  'amenity:cafe',
  'amenity:fast_food',
  'amenity:bar',
  'amenity:pub',
  'amenity:ice_cream',
  'shop:bakery',
  'shop:pastry',
]

const KIND_LABEL: Record<string, string> = {
  restaurant: 'Restaurante',
  cafe: 'Café',
  fast_food: 'Comida rápida',
  bar: 'Bar',
  pub: 'Bar',
  ice_cream: 'Heladería',
  bakery: 'Panadería',
  pastry: 'Pastelería',
}

const OSM_TYPES: Record<string, string> = { N: 'node', W: 'way', R: 'relation' }

type PhotonFeature = {
  geometry: { coordinates: [number, number] }
  properties: {
    name?: string
    osm_type?: string
    osm_id?: number
    osm_value?: string
    street?: string
    housenumber?: string
    district?: string
    city?: string
  }
}

export async function searchFood(
  term: string,
  near: { lng: number; lat: number } | null,
  signal: AbortSignal,
): Promise<GeoResult[]> {
  // `lang=default`: nombres como en OSM ("Avenida Simón Bolívar"), no traducidos.
  const params = new URLSearchParams({ q: term, limit: '6', bbox: LIMA_BBOX, lang: 'default' })
  for (const tag of FOOD_TAGS) params.append('osm_tag', tag)
  // Sesgo hacia lo que estás mirando: "Tanta" da primero el más cercano.
  if (near) {
    params.set('lat', near.lat.toFixed(5))
    params.set('lon', near.lng.toFixed(5))
  }

  const response = await fetch(`${ENDPOINT}?${params}`, { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data: { features?: PhotonFeature[] } = await response.json()

  return (data.features ?? []).flatMap((feature): GeoResult[] => {
    const props = feature.properties
    const name = props.name?.trim()
    const type = props.osm_type && OSM_TYPES[props.osm_type]
    if (!name || !type || props.osm_id == null) return []

    const street = [props.street, props.housenumber].filter(Boolean).join(' ')
    const address = [street, props.district ?? props.city].filter(Boolean).join(', ')
    const kind = props.osm_value ? KIND_LABEL[props.osm_value] : undefined
    const osmId = `${type}/${props.osm_id}`

    return [
      {
        id: osmId,
        name,
        detail: [kind, address].filter(Boolean).join(' · '),
        center: feature.geometry.coordinates,
        category: props.osm_value,
        osmId,
        cuisine: kind,
        address: address || undefined,
      },
    ]
  })
}
