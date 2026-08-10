import type { Map as MapLibreMap } from 'maplibre-gl'

/** Identificadores de la fuente y las capas de locales de OSM. */

export const OSM_SOURCE = 'osm-places'
export const OSM_CLUSTER_LAYER = 'osm-clusters'
export const OSM_CLUSTER_COUNT_LAYER = 'osm-cluster-count'
export const OSM_POINT_LAYER = 'osm-points'
export const OSM_LABEL_LAYER = 'osm-labels'

export const OSM_LAYERS = [
  OSM_CLUSTER_LAYER,
  OSM_CLUSTER_COUNT_LAYER,
  OSM_POINT_LAYER,
  OSM_LABEL_LAYER,
]

/** Capas que responden al clic, de arriba abajo. */
export function osmHitLayers(map: MapLibreMap): string[] {
  return [OSM_POINT_LAYER, OSM_CLUSTER_LAYER].filter((id) => map.getLayer(id))
}
