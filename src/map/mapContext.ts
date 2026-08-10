import type { MapLibreMap } from 'maplibre-gl'
import { createContext, useContext } from 'react'
import type { BasemapId } from './basemaps'

export type MapContextValue = {
  map: MapLibreMap
  basemap: BasemapId
  setBasemap: (id: BasemapId) => void
}

export const MapContext = createContext<MapContextValue | null>(null)

/** Acceso a la instancia del mapa desde cualquier componente del overlay. */
export function useMap(): MapContextValue {
  const ctx = useContext(MapContext)
  if (!ctx) {
    throw new Error('useMap() debe usarse dentro de <MapProvider>')
  }
  return ctx
}
