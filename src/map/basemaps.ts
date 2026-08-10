import type { StyleSpecification } from 'maplibre-gl'

/**
 * Estilos de mapa base. Todos son gratuitos y sin API key:
 * - CARTO (vectorial, sobre datos de OpenStreetMap)
 * - Esri World Imagery (raster) para la vista satélite
 */

const OSM_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> · © <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>'

const ESRI_ATTRIBUTION =
  'Imágenes © <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a>, Maxar, Earthstar Geographics'

const satelliteStyle: StyleSpecification = {
  version: 8,
  // Tipografías para las capas propias (etiquetas y contadores de grupo):
  // este estilo es de cosecha propia y, sin esto, no habría con qué dibujarlas.
  glyphs: 'https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf',
  sources: {
    imagery: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution: ESRI_ATTRIBUTION,
    },
    labels: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [
    { id: 'imagery', type: 'raster', source: 'imagery' },
    { id: 'labels', type: 'raster', source: 'labels' },
  ],
}

export type BasemapId = 'streets' | 'dark' | 'satellite'

export type Basemap = {
  id: BasemapId
  label: string
  /** Miniatura del selector: degradado que evoca el estilo */
  swatch: string
  style: string | StyleSpecification
}

export const BASEMAPS: Record<BasemapId, Basemap> = {
  streets: {
    id: 'streets',
    label: 'Mapa',
    swatch: 'linear-gradient(135deg, #f8f4f0 0%, #e8e0d5 45%, #cfe3c8 100%)',
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
  dark: {
    id: 'dark',
    label: 'Oscuro',
    swatch: 'linear-gradient(135deg, #2b2b33 0%, #16161a 55%, #0d1b26 100%)',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  },
  satellite: {
    id: 'satellite',
    label: 'Satélite',
    swatch: 'linear-gradient(135deg, #4a6741 0%, #2d4a35 40%, #1f3a52 100%)',
    style: satelliteStyle,
  },
}

export const BASEMAP_LIST = Object.values(BASEMAPS)

export const DEFAULT_BASEMAP: BasemapId = 'streets'

export function isBasemapId(value: unknown): value is BasemapId {
  return typeof value === 'string' && value in BASEMAPS
}

export { OSM_ATTRIBUTION }
