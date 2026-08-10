/**
 * Locales de OpenStreetMap: el catálogo vivo que se pinta sobre el mapa.
 *
 * Aquí solo se traducen las etiquetas crudas de OSM a algo que la app pueda
 * enseñar y guardar. Nada se inventa: si OSM no tiene el dato, el campo va
 * vacío y el formulario lo deja en blanco.
 */

export type OsmCategory = 'restaurant' | 'fast_food' | 'cafe' | 'bar' | 'bakery'

export type OsmPlace = {
  /** Identificador estable de OSM: "node/123", "way/456". */
  id: string
  name: string
  lng: number
  lat: number
  category: OsmCategory
  /** Etiqueta de cocina ya traducida ("Cevichería", "Chifa"…). */
  cuisine?: string
  address?: string
  phone?: string
  website?: string
  openingHours?: string
}

export const OSM_CATEGORIES: {
  id: OsmCategory
  label: string
  emoji: string
  /** Color del punto en el mapa. Paleta Material, como el resto de la app. */
  color: string
}[] = [
  { id: 'restaurant', label: 'Restaurantes', emoji: '🍽', color: '#e8710a' },
  { id: 'fast_food', label: 'Comida rápida', emoji: '🍔', color: '#f9ab00' },
  { id: 'cafe', label: 'Cafés y heladerías', emoji: '☕', color: '#a8642a' },
  { id: 'bar', label: 'Bares', emoji: '🍸', color: '#9334e6' },
  { id: 'bakery', label: 'Panaderías', emoji: '🥐', color: '#12b5cb' },
]

export const OSM_CATEGORY_COLOR: Record<OsmCategory, string> = Object.fromEntries(
  OSM_CATEGORIES.map((item) => [item.id, item.color]),
) as Record<OsmCategory, string>

export function categoryLabel(category: OsmCategory): string {
  return OSM_CATEGORIES.find((item) => item.id === category)?.label ?? 'Local'
}

/** Etiquetas de OSM tal cual llegan de Overpass. */
export type OsmTags = Record<string, string | undefined>

export type OverpassElement = {
  type: 'node' | 'way' | 'relation'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: OsmTags
}

function categoryFromTags(tags: OsmTags): OsmCategory | null {
  switch (tags.amenity) {
    case 'restaurant':
      return 'restaurant'
    case 'fast_food':
    case 'food_court':
      return 'fast_food'
    case 'cafe':
    case 'ice_cream':
      return 'cafe'
    case 'bar':
    case 'pub':
    case 'biergarten':
      return 'bar'
  }
  // Las tiendas que entran en la consulta son todas de comer al momento.
  return tags.shop ? 'bakery' : null
}

/**
 * Cocinas frecuentes en Lima. OSM las escribe en inglés y a veces encadenadas
 * con `;`; nos quedamos con la primera que sepamos traducir.
 */
const CUISINES: Record<string, string> = {
  peruvian: 'Peruana',
  regional: 'Criolla',
  criollo: 'Criolla',
  seafood: 'Cevichería',
  fish: 'Cevichería',
  ceviche: 'Cevichería',
  chicken: 'Pollería',
  grill: 'Parrilla',
  barbecue: 'Parrilla',
  steak_house: 'Parrilla',
  chinese: 'Chifa',
  japanese: 'Japonesa',
  sushi: 'Sushi',
  nikkei: 'Nikkei',
  italian: 'Italiana',
  pizza: 'Pizzería',
  pasta: 'Pastas',
  burger: 'Hamburguesas',
  sandwich: 'Sanguchería',
  coffee_shop: 'Cafetería',
  cafe: 'Cafetería',
  ice_cream: 'Heladería',
  bakery: 'Panadería',
  cake: 'Pastelería',
  dessert: 'Postres',
  mexican: 'Mexicana',
  spanish: 'Española',
  american: 'Americana',
  international: 'Internacional',
  asian: 'Asiática',
  thai: 'Tailandesa',
  korean: 'Coreana',
  indian: 'India',
  arab: 'Árabe',
  vegetarian: 'Vegetariana',
  vegan: 'Vegana',
  breakfast: 'Desayunos',
  chicken_wings: 'Alitas',
  fish_and_chips: 'Pescados',
  juice: 'Jugos',
  empanada: 'Empanadas',
  pollo_a_la_brasa: 'Pollería',
}

function prettify(value: string): string {
  const clean = value.replaceAll('_', ' ').trim()
  return clean ? clean[0].toUpperCase() + clean.slice(1) : ''
}

function cuisineFromTags(tags: OsmTags): string | undefined {
  const raw = tags.cuisine
  if (!raw) return undefined

  const parts = raw.split(';').map((part) => part.trim().toLowerCase())
  for (const part of parts) {
    if (CUISINES[part]) return CUISINES[part]
  }
  return prettify(parts[0]) || undefined
}

function addressFromTags(tags: OsmTags): string | undefined {
  const street = [tags['addr:street'], tags['addr:housenumber']]
    .filter(Boolean)
    .join(' ')
  const area = tags['addr:district'] ?? tags['addr:city'] ?? tags['addr:suburb']
  const address = [street, area].filter(Boolean).join(', ')
  return address || undefined
}

/** Convierte un elemento de Overpass en un sitio, o `null` si no sirve. */
export function toPlace(element: OverpassElement): OsmPlace | null {
  const tags = element.tags
  if (!tags) return null

  const category = categoryFromTags(tags)
  if (!category) return null

  const lng = element.lon ?? element.center?.lon
  const lat = element.lat ?? element.center?.lat
  if (typeof lng !== 'number' || typeof lat !== 'number') return null

  const name = tags.name?.trim()
  // Un local sin nombre no aporta nada al mapa: no se puede reconocer ni buscar.
  if (!name) return null

  return {
    id: `${element.type}/${element.id}`,
    name,
    lng,
    lat,
    category,
    cuisine: cuisineFromTags(tags),
    address: addressFromTags(tags),
    phone: tags.phone ?? tags['contact:phone'],
    website: tags.website ?? tags['contact:website'],
    openingHours: tags.opening_hours,
  }
}
