import type { Bbox } from './overpass'
import type { OsmPlace } from './places'

/**
 * Caché de los locales de OSM en una rejilla de celdas fijas.
 *
 * La ciudad se divide en cuadrados de tamaño constante; cada celda se pide a
 * Overpass una sola vez y se guarda en IndexedDB. Así, moverse por Lima acaba
 * siendo instantáneo y sin red, y el servidor comunitario recibe una fracción
 * de las consultas.
 *
 * Va en su propia base de datos porque es material desechable: se puede borrar
 * entera sin tocar los restaurantes del usuario.
 */

const DB_NAME = 'osm-cache'
const DB_VERSION = 1
const STORE = 'cells'

/** Lado de la celda en grados (~2,2 km en el ecuador). */
export const CELL = 0.02

/** Los locales cambian poco; un mes es un buen equilibrio. */
const TTL_MS = 30 * 24 * 60 * 60 * 1000

export type Cell = { x: number; y: number }

/** Rectángulo de celdas, con ambos extremos incluidos. */
export type Rect = { minX: number; maxX: number; minY: number; maxY: number }

type CellRecord = {
  key: string
  fetchedAt: number
  places: OsmPlace[]
}

export function cellKey({ x, y }: Cell): string {
  return `${x}:${y}`
}

export function cellOf(lng: number, lat: number): Cell {
  return { x: Math.floor(lng / CELL), y: Math.floor(lat / CELL) }
}

export function rectFromBbox([west, south, east, north]: Bbox): Rect {
  return {
    minX: Math.floor(west / CELL),
    maxX: Math.floor(east / CELL),
    minY: Math.floor(south / CELL),
    maxY: Math.floor(north / CELL),
  }
}

export function rectFromCells(cells: Cell[]): Rect {
  const xs = cells.map((cell) => cell.x)
  const ys = cells.map((cell) => cell.y)
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

export function cellsOfRect(rect: Rect): Cell[] {
  const cells: Cell[] = []
  for (let x = rect.minX; x <= rect.maxX; x += 1) {
    for (let y = rect.minY; y <= rect.maxY; y += 1) {
      cells.push({ x, y })
    }
  }
  return cells
}

export function bboxOfRect(rect: Rect): Bbox {
  return [
    rect.minX * CELL,
    rect.minY * CELL,
    (rect.maxX + 1) * CELL,
    (rect.maxY + 1) * CELL,
  ]
}

export function rectContains(rect: Rect, cell: Cell): boolean {
  return (
    cell.x >= rect.minX &&
    cell.x <= rect.maxX &&
    cell.y >= rect.minY &&
    cell.y <= rect.maxY
  )
}

/**
 * Recorta un rectángulo a un tamaño máximo conservando el centro dentro.
 * Sirve para que una consulta nunca abarque medio Lima de golpe.
 */
export function clampRect(rect: Rect, center: Cell, maxW: number, maxH: number): Rect {
  const fit = (min: number, max: number, pivot: number, size: number) => {
    if (max - min + 1 <= size) return [min, max] as const
    let start = Math.min(Math.max(pivot - Math.floor((size - 1) / 2), min), max - size + 1)
    start = Math.max(start, min)
    return [start, start + size - 1] as const
  }

  const [minX, maxX] = fit(rect.minX, rect.maxX, center.x, maxW)
  const [minY, maxY] = fit(rect.minY, rect.maxY, center.y, maxH)
  return { minX, maxX, minY, maxY }
}

// ---------- Persistencia ----------

/** Primer nivel de caché: evita ir a IndexedDB en cada arrastre del mapa. */
const memory = new Map<string, OsmPlace[]>()

let dbPromise: Promise<IDBDatabase | null> | null = null

function openDb(): Promise<IDBDatabase | null> {
  dbPromise ??= new Promise<IDBDatabase | null>((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'key' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      // Sin IndexedDB (modo privado, cuota llena) la app sigue: solo cachea en RAM.
      request.onerror = () => resolve(null)
    } catch {
      resolve(null)
    }
  })
  return dbPromise
}

/** Devuelve las celdas que ya estaban cacheadas y siguen frescas. */
export async function readCells(
  cells: Cell[],
): Promise<Map<string, OsmPlace[]>> {
  const found = new Map<string, OsmPlace[]>()
  const pending: string[] = []

  for (const cell of cells) {
    const key = cellKey(cell)
    const cached = memory.get(key)
    if (cached) found.set(key, cached)
    else pending.push(key)
  }

  if (!pending.length) return found

  const db = await openDb()
  if (!db) return found

  await new Promise<void>((resolve) => {
    let transaction: IDBTransaction
    try {
      transaction = db.transaction(STORE, 'readonly')
    } catch {
      resolve()
      return
    }

    const store = transaction.objectStore(STORE)
    const threshold = Date.now() - TTL_MS

    for (const key of pending) {
      const request = store.get(key)
      request.onsuccess = () => {
        const record: CellRecord | undefined = request.result
        if (record && record.fetchedAt >= threshold) {
          memory.set(key, record.places)
          found.set(key, record.places)
        }
      }
    }

    transaction.oncomplete = () => resolve()
    transaction.onerror = () => resolve()
    transaction.onabort = () => resolve()
  })

  return found
}

/** Marca un grupo de celdas como descargadas, con los locales que caen dentro. */
export async function writeCells(entries: Map<string, OsmPlace[]>): Promise<void> {
  for (const [key, places] of entries) memory.set(key, places)

  const db = await openDb()
  if (!db) return

  try {
    const transaction = db.transaction(STORE, 'readwrite')
    const store = transaction.objectStore(STORE)
    const fetchedAt = Date.now()
    for (const [key, places] of entries) {
      const record: CellRecord = { key, fetchedAt, places }
      store.put(record)
    }
  } catch {
    // La caché es un lujo, no un requisito.
  }
}
