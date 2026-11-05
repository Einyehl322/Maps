import { isPriceLevel, quoteTotals, type PriceLevel } from './price'
import { newId, type Dish, type Restaurant } from './types'

/**
 * El diario: un registro de todo lo que hacemos en la app. Cada entrada
 * guarda el nombre del lugar, así que sigue teniendo sentido aunque el lugar
 * se borre después.
 */

export type Activity =
  | Entry<'place_added', { status: Restaurant['status'] }>
  | Entry<'visited', { date?: string }>
  | Entry<'wishlist', Record<string, never>>
  | Entry<'message', { message: string }>
  | Entry<'price_level', { level: PriceLevel }>
  | Entry<'dish_added', { name: string; rating: number; price?: number }>
  | Entry<'photos_added', { photoIds: string[] }>
  | Entry<'quote_saved', { total: number; perPerson: number; people: number }>
  | Entry<'place_removed', Record<string, never>>

type Entry<K extends string, D> = {
  id: string
  kind: K
  placeId?: string
  placeName: string
  detail: D
  /** Correo de quien lo hizo (vacío en modo local). */
  actor?: string
  /** ISO. */
  at: string
}

export type ActivityKind = Activity['kind']

type NewEntry = { [K in ActivityKind]: Omit<Extract<Activity, { kind: K }>, 'id' | 'at' | 'actor' | 'placeId' | 'placeName'> }[ActivityKind]

function entry(place: Restaurant, data: NewEntry, actor?: string, at?: string): Activity {
  return {
    id: newId(),
    placeId: place.id,
    placeName: place.name,
    actor,
    at: at ?? new Date().toISOString(),
    ...data,
  } as Activity
}

/** Qué cambió al guardar un lugar, como entradas del diario. */
export function diffPlace(
  previous: Restaurant | undefined,
  saved: Restaurant,
  actor?: string,
): Activity[] {
  const events: Activity[] = []

  if (!previous) {
    events.push(entry(saved, { kind: 'place_added', detail: { status: saved.status } }, actor))
  } else if (previous.status !== saved.status) {
    events.push(
      saved.status === 'visited'
        ? entry(saved, { kind: 'visited', detail: { date: saved.visitedAt } }, actor)
        : entry(saved, { kind: 'wishlist', detail: {} }, actor),
    )
  }

  if (saved.message && saved.message !== previous?.message) {
    events.push(entry(saved, { kind: 'message', detail: { message: saved.message } }, actor))
  }

  if (saved.priceLevel && saved.priceLevel !== previous?.priceLevel) {
    events.push(entry(saved, { kind: 'price_level', detail: { level: saved.priceLevel } }, actor))
  }

  const quote = saved.quote
  if (quote && quote.items.length && quote.updatedAt !== previous?.quote?.updatedAt) {
    const totals = quoteTotals(quote.items, quote.people, quote.tipPercent)
    events.push(
      entry(
        saved,
        {
          kind: 'quote_saved',
          detail: { total: totals.total, perPerson: totals.perPerson, people: quote.people },
        },
        actor,
      ),
    )
  }

  return events
}

export function dishAdded(place: Restaurant, dish: Dish, actor?: string): Activity {
  return entry(
    place,
    { kind: 'dish_added', detail: { name: dish.name, rating: dish.rating, price: dish.price } },
    actor,
  )
}

export function photosAdded(place: Restaurant, photoIds: string[], actor?: string): Activity {
  return entry(place, { kind: 'photos_added', detail: { photoIds } }, actor)
}

export function placeRemoved(place: Restaurant, actor?: string): Activity {
  return entry(place, { kind: 'place_removed', detail: {} }, actor)
}

/**
 * Lo que ya había antes de que existiera el diario, reconstruido con las
 * fechas guardadas. Los ids son fijos: repetirlo no duplica nada.
 */
export function backfill(places: Restaurant[]): Activity[] {
  return places.flatMap((place) => {
    const base = { placeId: place.id, placeName: place.name }
    const events: Activity[] = [
      {
        ...base,
        id: `pasado-lugar-${place.id}`,
        kind: 'place_added',
        detail: { status: place.status },
        at: place.createdAt,
      },
    ]
    const visitedAt = middayOf(place.visitedAt)
    if (place.status === 'visited' && visitedAt) {
      events.push({
        ...base,
        id: `pasado-visita-${place.id}`,
        kind: 'visited',
        detail: { date: place.visitedAt },
        at: visitedAt,
      })
    }
    for (const dish of place.dishes) {
      events.push({
        ...base,
        id: `pasado-plato-${dish.id}`,
        kind: 'dish_added',
        detail: { name: dish.name, rating: dish.rating, price: dish.price },
        at: dish.createdAt,
      })
    }
    if (place.priceLevel) {
      events.push({
        ...base,
        id: `pasado-precio-${place.id}`,
        kind: 'price_level',
        detail: { level: place.priceLevel },
        at: place.createdAt,
      })
    }
    if (place.message) {
      events.push({
        ...base,
        id: `pasado-mensaje-${place.id}`,
        kind: 'message',
        detail: { message: place.message },
        actor: place.messageFrom,
        at: place.updatedAt,
      })
    }
    const quote = place.quote
    if (quote?.items.length) {
      const totals = quoteTotals(quote.items, quote.people, quote.tipPercent)
      events.push({
        ...base,
        id: `pasado-cotizacion-${place.id}`,
        kind: 'quote_saved',
        detail: { total: totals.total, perPerson: totals.perPerson, people: quote.people },
        at: quote.updatedAt || place.updatedAt,
      })
    }
    return events
  })
}

/** Mediodía local de un `yyyy-mm-dd`, en ISO: la visita no tiene hora. */
function middayOf(day: string | undefined): string | null {
  const match = day && /^(\d{4})-(\d{2})-(\d{2})/.exec(day)
  if (!match) return null
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12).toISOString()
}

/** Qué hecho describe una entrada, para no contar dos veces lo mismo. */
export function factKey(item: Activity): string {
  const extra = item.kind === 'dish_added' ? item.detail.name.toLowerCase() : ''
  return `${item.kind}|${item.placeId ?? item.placeName}|${extra}`
}

/** Ordena de lo más reciente a lo más antiguo comparando fechas, no textos. */
export function byNewest(a: Activity, b: Activity): number {
  return Date.parse(b.at) - Date.parse(a.at)
}

const KINDS: ActivityKind[] = [
  'place_added',
  'visited',
  'wishlist',
  'message',
  'price_level',
  'dish_added',
  'photos_added',
  'quote_saved',
  'place_removed',
]

/** Valida lo que llega de la base de datos o de IndexedDB. */
export function parseActivity(raw: unknown): Activity | null {
  if (typeof raw !== 'object' || raw === null) return null
  const item = raw as Partial<Activity> & { detail?: Record<string, unknown> }
  if (typeof item.id !== 'string' || typeof item.placeName !== 'string') return null
  if (typeof item.at !== 'string' || !KINDS.includes(item.kind as ActivityKind)) return null
  const detail = item.detail ?? {}
  if (item.kind === 'price_level' && !isPriceLevel(detail.level)) return null
  return { ...item, detail } as Activity
}
