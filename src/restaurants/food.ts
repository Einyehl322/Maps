import { LIMA_RECOMMENDATIONS, recFoodCategory, type Recommendation } from './lima'
import type { Restaurant } from './types'

/**
 * Tipos de cocina para agrupar y filtrar: criollo, marino, norteño…
 *
 * Un lugar guardado puede tener su categoría elegida a mano; si no, se deduce
 * del "tipo de lugar" y del nombre con palabras clave.
 */

export type FoodCategory =
  | 'criollo'
  | 'marino'
  | 'norteno'
  | 'arequipeno'
  | 'selvatico'
  | 'chifa'
  | 'nikkei'
  | 'polleria'
  | 'parrilla'
  | 'sangucheria'
  | 'italiana'
  | 'cafe'
  | 'bar'
  | 'alta-cocina'
  | 'mercado'
  | 'otro'

export type FoodCategoryInfo = {
  id: FoodCategory
  label: string
  emoji: string
  /** Para buscar más lugares así en el mapa (Photon). */
  searchTerm: string
  /** Palabras (sin tildes, en minúsculas) que delatan la categoría. */
  keywords: string[]
}

export const FOOD_CATEGORIES: FoodCategoryInfo[] = [
  {
    id: 'criollo',
    label: 'Criollo',
    emoji: '🍲',
    searchTerm: 'criollo',
    keywords: ['crioll', 'peruan', 'peruvian', 'taberna', 'huarique', 'regional'],
  },
  {
    id: 'marino',
    label: 'Marino',
    emoji: '🐟',
    searchTerm: 'cevicheria',
    keywords: ['cevich', 'cebich', 'marisc', 'pescad', 'seafood', 'marino', 'marina', 'chalac', 'pulpo'],
  },
  {
    id: 'norteno',
    label: 'Norteño',
    emoji: '🌵',
    searchTerm: 'norteño',
    keywords: ['norten', 'chiclay', 'piura', 'trujill', 'lambayeq', 'cabrito', 'tumbes', 'mochica'],
  },
  {
    id: 'arequipeno',
    label: 'Arequipeño',
    emoji: '🌋',
    searchTerm: 'arequipeño',
    keywords: ['arequip', 'picanter', 'rocoto relleno', 'misti', 'chupe'],
  },
  {
    id: 'selvatico',
    label: 'Selvático',
    emoji: '🌿',
    searchTerm: 'selva',
    keywords: ['selv', 'amazon', 'amaz', 'juane', 'cecina', 'tacacho', 'charap', 'iquit', 'pucallp'],
  },
  {
    id: 'chifa',
    label: 'Chifa',
    emoji: '🥡',
    searchTerm: 'chifa',
    keywords: ['chifa', 'chines', 'chinese', 'wok', 'cantones'],
  },
  {
    id: 'nikkei',
    label: 'Nikkei',
    emoji: '🍣',
    searchTerm: 'nikkei',
    keywords: ['nikkei', 'japon', 'japanese', 'sushi', 'ramen', 'maki'],
  },
  {
    id: 'polleria',
    label: 'Pollería',
    emoji: '🍗',
    searchTerm: 'pollería',
    keywords: ['poller', 'pollo', 'chicken', 'brasa'],
  },
  {
    id: 'parrilla',
    label: 'Parrillas',
    emoji: '🔥',
    searchTerm: 'anticuchos',
    keywords: ['parrill', 'anticuch', 'grill', 'steak', 'carne', 'barbecue', 'bbq'],
  },
  {
    id: 'sangucheria',
    label: 'Sanguchería',
    emoji: '🥪',
    searchTerm: 'sanguchería',
    keywords: ['sanguch', 'sandwich', 'burger', 'hamburg', 'chicharr'],
  },
  {
    id: 'italiana',
    label: 'Italiana',
    emoji: '🍝',
    searchTerm: 'trattoria',
    keywords: ['italian', 'pizza', 'pasta', 'trattor'],
  },
  {
    id: 'cafe',
    label: 'Café y postres',
    emoji: '☕',
    searchTerm: 'café',
    keywords: ['cafe', 'coffee', 'postre', 'pastel', 'panader', 'bakery', 'helad', 'ice cream', 'dessert', 'tostadur'],
  },
  {
    id: 'bar',
    label: 'Bar',
    emoji: '🍸',
    searchTerm: 'bar',
    keywords: ['bar', 'pisco', 'cocktail', 'coctel', 'cervec', 'pub'],
  },
  {
    id: 'alta-cocina',
    label: 'Alta cocina',
    emoji: '🥂',
    searchTerm: 'restaurante',
    keywords: ['alta cocina', 'degustac', 'fine dining', 'tasting'],
  },
  {
    id: 'mercado',
    label: 'Mercado',
    emoji: '🧺',
    searchTerm: 'mercado',
    keywords: ['mercado', 'market'],
  },
  { id: 'otro', label: 'Otros', emoji: '🍽', searchTerm: 'restaurante', keywords: [] },
]

const BY_ID = new Map(FOOD_CATEGORIES.map((item) => [item.id, item]))

export function foodCategoryInfo(id: FoodCategory): FoodCategoryInfo {
  return BY_ID.get(id) ?? BY_ID.get('otro')!
}

export function isFoodCategory(value: unknown): value is FoodCategory {
  return typeof value === 'string' && BY_ID.has(value as FoodCategory)
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

/**
 * Deduce la categoría a partir de textos libres ("Cevichería", "Chiclayana",
 * el nombre del local…). El orden de FOOD_CATEGORIES decide los empates:
 * "Cevichería norteña" cae en marino antes que en norteño… salvo que diga
 * "norteñ", que se mira primero por ser lo más específico.
 */
export function guessFoodCategory(...texts: (string | undefined)[]): FoodCategory {
  const haystack = normalize(texts.filter(Boolean).join(' '))
  if (!haystack.trim()) return 'otro'
  // Lo regional es lo más específico: "Cevichería norteña" es norteño.
  for (const id of ['norteno', 'arequipeno', 'selvatico'] as const) {
    if (BY_ID.get(id)!.keywords.some((word) => haystack.includes(word))) return id
  }
  for (const info of FOOD_CATEGORIES) {
    if (info.keywords.some((word) => matches(haystack, word))) return info.id
  }
  return 'otro'
}

/** "bar" no debe saltar con "barra" ni "Barranco": las palabras cortas van enteras. */
function matches(haystack: string, word: string): boolean {
  if (word.length > 3) return haystack.includes(word)
  return new RegExp(`\\b${word}\\b`).test(haystack)
}

const REC_BY_ID = new Map(LIMA_RECOMMENDATIONS.map((rec) => [rec.id, rec]))

/**
 * El lugar de la guía que corresponde a uno guardado: el enlazado, o uno cuyo
 * nombre empieza igual ("Museo Larco" → "Museo Larco Café Restaurant").
 */
export function linkedRec(place: Restaurant): Recommendation | undefined {
  if (place.recId) return REC_BY_ID.get(place.recId)
  const name = normalize(place.name).trim()
  if (name.length < 6) return undefined
  return LIMA_RECOMMENDATIONS.find((rec) => normalize(rec.name).startsWith(name))
}

/** La categoría de un lugar guardado: la elegida, la de la guía o la deducida. */
export function placeFoodCategory(place: Restaurant): FoodCategory {
  if (place.foodCategory) return place.foodCategory
  const rec = linkedRec(place)
  if (rec) return recFoodCategory(rec)
  return guessFoodCategory(place.cuisine, place.name)
}
