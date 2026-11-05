/**
 * Precios: rango por persona, lo que llevamos gastado y cotizaciones de salidas.
 * Todo en soles (S/).
 */

/** 1 = barato · 2 = medio · 3 = caro · 4 = menú degustación. */
export type PriceLevel = 1 | 2 | 3 | 4

export const PRICE_LEVELS: PriceLevel[] = [1, 2, 3, 4]

/** Orientativo por persona, sin bebida. */
export const PRICE_LABELS: Record<PriceLevel, string> = {
  1: 'menos de S/ 30',
  2: 'S/ 30 a 70',
  3: 'S/ 70 a 150',
  4: 'menú degustación, S/ 150+',
}

/** Lo mismo en números, para estimar. `null` = sin tope. */
const PRICE_RANGES: Record<PriceLevel, [number, number | null]> = {
  1: [10, 30],
  2: [30, 70],
  3: [70, 150],
  4: [150, null],
}

export function isPriceLevel(value: unknown): value is PriceLevel {
  return value === 1 || value === 2 || value === 3 || value === 4
}

/** "S/", "S/S/"… para la lista compacta. */
export function priceMark(level: PriceLevel): string {
  return 'S/'.repeat(level)
}

const soles = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
})

const solesRound = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  maximumFractionDigits: 0,
})

export function formatSoles(amount: number, round = false): string {
  return (round ? solesRound : soles).format(amount)
}

/** "S/ 60 a S/ 140" para `people` personas según el rango del lugar. */
export function estimateForPeople(level: PriceLevel, people: number): string {
  const [min, max] = PRICE_RANGES[level]
  if (max === null) return `desde ${formatSoles(min * people, true)}`
  return `${formatSoles(min * people, true)} a ${formatSoles(max * people, true)}`
}

/** Acepta "45", "45.5" y "45,50". `null` si no es un número válido. */
export function parseAmount(text: string): number | null {
  const value = Number.parseFloat(text.replace(',', '.'))
  return Number.isFinite(value) && value >= 0 ? value : null
}

// ---------- Cuánto gastamos ----------

export type Spending = {
  total: number
  /** Platos con precio apuntado. */
  priced: number
  /** Platos sin precio: el total se queda corto. */
  unpriced: number
}

export function spendingOf(dishes: { price?: number }[]): Spending {
  let total = 0
  let priced = 0
  for (const dish of dishes) {
    if (dish.price == null) continue
    total += dish.price
    priced += 1
  }
  return { total, priced, unpriced: dishes.length - priced }
}

// ---------- Cotizar una salida ----------

export type QuoteItem = {
  id: string
  name: string
  /** Precio unitario en soles. */
  price: number
  qty: number
}

export type Quote = {
  people: number
  /** Propina en %, 0 si no se deja. */
  tipPercent: number
  items: QuoteItem[]
  updatedAt: string
}

export const TIP_OPTIONS = [0, 10, 15]

export type QuoteTotals = {
  subtotal: number
  tip: number
  total: number
  perPerson: number
}

export function quoteTotals(
  items: { price: number; qty: number }[],
  people: number,
  tipPercent: number,
): QuoteTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const tip = (subtotal * tipPercent) / 100
  const total = subtotal + tip
  return { subtotal, tip, total, perPerson: people > 0 ? total / people : total }
}

/** Valida lo que llega de la base de datos o de IndexedDB. */
export function parseQuote(value: unknown): Quote | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const raw = value as Partial<Quote>
  if (!Array.isArray(raw.items)) return undefined
  const items = raw.items.filter(
    (item): item is QuoteItem =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.price === 'number' &&
      typeof item.qty === 'number',
  )
  return {
    people: typeof raw.people === 'number' && raw.people > 0 ? raw.people : 2,
    tipPercent: typeof raw.tipPercent === 'number' ? raw.tipPercent : 10,
    items,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
  }
}
