import { PEOPLE } from '../lib/couple'
import { linkedRec, placeFoodCategory, type FoodCategory } from './food'
import { LIMA_RECOMMENDATIONS, recFoodCategory, type Recommendation } from './lima'
import { PRICE_RANGES, quoteTotals, type Confidence, type MenuPrices } from './price'
import type { Restaurant } from './types'

/** Mediana: el valor del medio (o el promedio de los dos del medio). */
function median(values: number[]): number | null {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

/**
 * Cuánto cuesta por persona según la carta: un fondo y una bebida.
 * `low` con lo más barato, `typical` con lo del medio. Sin fondos, se usa
 * cualquier plato (cafés, sangucherías…).
 */
export function perPersonFromMenu(menu: MenuPrices): { low: number; typical: number } | null {
  if (!menu.found) return null
  const of = (category: string) =>
    menu.items.filter((item) => item.category === category).map((item) => item.price)
  const mains = of('fondo').length
    ? of('fondo')
    : menu.items.filter((item) => item.category !== 'bebida').map((item) => item.price)
  // El maridaje de un menú degustación es opcional y cuesta como otro menú:
  // no cuenta como "la bebida" de cada uno.
  const drinks = menu.items
    .filter((item) => item.category === 'bebida' && !/maridaje|pairing/i.test(item.name))
    .map((item) => item.price)
  if (!mains.length) return null
  const low = Math.min(...mains) + (drinks.length ? Math.min(...drinks) : 0)
  const typical = median(mains)! + (drinks.length ? median(drinks)! : 0)
  return { low, typical: Math.max(low, typical) }
}

// ---------- ¿A dónde nos alcanza? ----------


/** Un lugar candidato: uno guardado o uno de la guía que aún no guardaron. */
export type Candidate = {
  key: string
  name: string
  district?: string
  category: FoodCategory
  place?: Restaurant
  rec?: Recommendation
}

export type Basis = 'cotizacion' | 'carta' | 'gastado' | 'rango'

export type Estimate = {
  /** Total para el grupo, con propina. */
  low: number
  /** null = sin tope conocido ("desde S/ X"). */
  high: number | null
  basis: Basis
  confidence?: Confidence
}

export type Verdict = 'fits' | 'tight' | 'over' | 'unknown'

export function candidates(places: Restaurant[]): Candidate[] {
  const savedRecs = new Set(places.map((place) => place.recId).filter(Boolean))
  return [
    ...places.map(
      (place): Candidate => ({
        key: `place:${place.id}`,
        name: place.name,
        district: linkedRec(place)?.district ?? districtFrom(place.address),
        category: placeFoodCategory(place),
        place,
      }),
    ),
    ...LIMA_RECOMMENDATIONS.filter((rec) => !savedRecs.has(rec.id)).map(
      (rec): Candidate => ({
        key: `rec:${rec.id}`,
        name: rec.name,
        district: rec.district,
        category: recFoodCategory(rec),
        rec,
      }),
    ),
  ]
}

/**
 * El distrito de una dirección libre: "Av. X 123, Surquillo" → "Surquillo".
 * Las de OpenStreetMap terminan en "…, Lima, 15084, Perú": se saltan esas.
 */
function districtFrom(address: string | undefined): string | undefined {
  const parts = (address ?? '').split(',').map((part) => part.trim()).filter(Boolean)
  const skip = /^(per[uú]|lima|lima metropolitana|callao|\d+)$/i
  return parts.slice(1).find((part) => !skip.test(part) && !/^(av|jr|calle|jir[oó]n|avenida|pasaje)\b/i.test(part))
}

/** La carta que corresponde: la propia del lugar o la de su ficha en la guía. */
export function menuFor(candidate: Candidate, lookups: Record<string, MenuPrices>) {
  const recId = (candidate.place && linkedRec(candidate.place)?.id) ?? candidate.rec?.id
  return lookups[candidate.key] ?? (recId ? lookups[`rec:${recId}`] : undefined)
}

/** Lo que costaría la salida para los dos, con propina. */
export function estimate(
  candidate: Candidate,
  lookups: Record<string, MenuPrices>,
  tipPercent: number,
): Estimate | null {
  const people = PEOPLE
  const tip = 1 + tipPercent / 100
  const place = candidate.place

  // 1. Su propia cotización: es lo que de verdad piensan pedir.
  const quote = place?.quote
  if (quote?.items.length) {
    const { total } = quoteTotals(quote.items, people, quote.tipPercent)
    return { low: total, high: total, basis: 'cotizacion' }
  }

  // 2. La carta real encontrada en internet.
  const menu = menuFor(candidate, lookups)
  const perPerson = menu ? perPersonFromMenu(menu) : null
  if (menu && perPerson) {
    return {
      low: perPerson.low * people * tip,
      high: perPerson.typical * people * tip,
      basis: 'carta',
      confidence: menu.confidence,
    }
  }

  // 3. Lo que ya gastaron ahí (un plato por persona, en promedio).
  const priced = (place?.dishes ?? []).filter((dish) => dish.price != null)
  if (priced.length) {
    const average = priced.reduce((sum, dish) => sum + dish.price!, 0) / priced.length
    const total = average * people * tip
    return { low: total, high: total, basis: 'gastado' }
  }

  // 4. El rango aproximado del lugar.
  const level = place?.priceLevel ?? candidate.rec?.price
  if (level) {
    const [min, max] = PRICE_RANGES[level]
    return {
      low: min * people * tip,
      high: max === null ? null : max * people * tip,
      basis: 'rango',
    }
  }
  return null
}

export function verdict(value: Estimate | null, budget: number): Verdict {
  if (!value) return 'unknown'
  if (value.high !== null && value.high <= budget) return 'fits'
  if (value.low <= budget) return 'tight'
  return 'over'
}
