import type { Map as MapLibreMap } from 'maplibre-gl'
import { useEffect, useState } from 'react'
import {
  cellKey,
  cellOf,
  cellsOfRect,
  clampRect,
  rectContains,
  rectFromBbox,
  rectFromCells,
  bboxOfRect,
  readCells,
  writeCells,
  type Cell,
} from './cache'
import { fetchPlacesInBbox } from './overpass'
import type { OsmPlace } from './places'

/**
 * Trae de OpenStreetMap los locales de la zona que se está mirando.
 *
 * La descarga se dispara al terminar de mover el mapa, nunca durante el
 * arrastre, y solo pide las celdas que aún no estén en caché.
 */

/** Por debajo de este zoom la zona es demasiado grande para pedirla entera. */
const MIN_ZOOM = 14

/** Techo de la consulta: 3 x 2 celdas ≈ 6,6 x 4,4 km. */
const MAX_CELLS_X = 3
const MAX_CELLS_Y = 2

const DEBOUNCE_MS = 400

export type OsmStatus = 'off' | 'zoom' | 'loading' | 'ready' | 'error'

export function useOsmPlaces(map: MapLibreMap, enabled: boolean) {
  const [places, setPlaces] = useState<OsmPlace[]>([])
  const [status, setStatus] = useState<OsmStatus>('off')

  useEffect(() => {
    if (!enabled) {
      setPlaces([])
      setStatus('off')
      return
    }

    let cancelled = false
    let controller: AbortController | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const sync = async () => {
      if (map.getZoom() < MIN_ZOOM) {
        setPlaces([])
        setStatus('zoom')
        return
      }

      const bounds = map.getBounds()
      const center = map.getCenter()
      const view = rectFromBbox([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ])
      const area = clampRect(
        view,
        cellOf(center.lng, center.lat),
        MAX_CELLS_X,
        MAX_CELLS_Y,
      )

      const cells = cellsOfRect(area)
      const loaded = await readCells(cells)
      if (cancelled) return

      const missing = cells.filter((cell) => !loaded.has(cellKey(cell)))

      if (missing.length) {
        setStatus('loading')
        // Se pide el rectángulo que envuelve lo que falta, no celda por celda.
        const needed = rectFromCells(missing)
        controller = new AbortController()

        try {
          const found = await fetchPlacesInBbox(bboxOfRect(needed), controller.signal)
          if (cancelled) return

          const fresh = new Map<string, OsmPlace[]>(
            cellsOfRect(needed).map((cell) => [cellKey(cell), []]),
          )
          for (const place of found) {
            const cell: Cell = cellOf(place.lng, place.lat)
            // Lo que cae justo fuera del rectángulo se descarta: ya llegará
            // cuando toque descargar su celda.
            if (rectContains(needed, cell)) fresh.get(cellKey(cell))?.push(place)
          }

          void writeCells(fresh)
          for (const [key, value] of fresh) loaded.set(key, value)
        } catch (error) {
          if (cancelled || controller.signal.aborted) return
          setStatus('error')
          void error
          return
        }
      }

      if (cancelled) return
      setPlaces([...loaded.values()].flat())
      setStatus('ready')
    }

    const schedule = () => {
      if (timer) clearTimeout(timer)
      controller?.abort()
      timer = setTimeout(() => {
        void sync()
      }, DEBOUNCE_MS)
    }

    void sync()
    map.on('moveend', schedule)

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      controller?.abort()
      map.off('moveend', schedule)
    }
  }, [map, enabled])

  return { places, status }
}
