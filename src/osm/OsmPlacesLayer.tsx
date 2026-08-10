import type { Feature, FeatureCollection, Point } from 'geojson'
import type {
  DataDrivenPropertyValueSpecification,
  GeoJSONSource,
  Map as MapLibreMap,
} from 'maplibre-gl'
import { useEffect } from 'react'
import type { BasemapId } from '../map/basemaps'
import { useMap } from '../map/mapContext'
import {
  OSM_CLUSTER_COUNT_LAYER,
  OSM_CLUSTER_LAYER,
  OSM_LABEL_LAYER,
  OSM_LAYERS,
  OSM_POINT_LAYER,
  OSM_SOURCE,
} from './layers'
import { OSM_CATEGORIES, type OsmPlace } from './places'

/**
 * Pinta los locales de OSM como capa vectorial con agrupación.
 *
 * Son miles de puntos: con marcadores DOM el navegador se arrodilla, así que
 * van en una fuente GeoJSON y los dibuja la GPU. La agrupación la calcula
 * MapLibre en un worker.
 */

/**
 * Un color por categoría, generado desde la misma lista que la leyenda.
 * El `as` es inevitable: al construir la expresión con un spread, TypeScript
 * pierde la forma de tupla que exige la firma de MapLibre.
 */
const colorByCategory = [
  'match',
  ['get', 'category'],
  ...OSM_CATEGORIES.flatMap((item) => [item.id, item.color]),
  '#5f6368',
] as unknown as DataDrivenPropertyValueSpecification<string>

type PlaceFeature = Feature<Point, Record<string, unknown>>

function toGeoJson(places: OsmPlace[]): FeatureCollection<Point> {
  const features: PlaceFeature[] = places.map((place) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
    properties: {
      id: place.id,
      name: place.name,
      category: place.category,
      cuisine: place.cuisine ?? '',
      address: place.address ?? '',
      phone: place.phone ?? '',
      website: place.website ?? '',
      openingHours: place.openingHours ?? '',
    },
  }))
  return { type: 'FeatureCollection', features }
}

/**
 * Los nombres se leen sobre tres fondos muy distintos: en el mapa claro van en
 * gris con halo blanco, y sobre el oscuro o el satélite se invierten.
 */
function labelColors(basemap: BasemapId): { text: string; halo: string } {
  return basemap === 'streets'
    ? { text: '#3c4043', halo: '#fff' }
    : { text: '#fff', halo: 'rgba(0, 0, 0, 0.8)' }
}

function addLayers(
  map: MapLibreMap,
  data: FeatureCollection<Point>,
  basemap: BasemapId,
) {
  map.addSource(OSM_SOURCE, {
    type: 'geojson',
    data,
    cluster: true,
    clusterRadius: 45,
    clusterMaxZoom: 15,
    attribution:
      'Locales © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">colaboradores de OpenStreetMap</a>',
  })

  map.addLayer({
    id: OSM_CLUSTER_LAYER,
    type: 'circle',
    source: OSM_SOURCE,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#f9ab00',
        25,
        '#e8710a',
        100,
        '#d93025',
      ],
      'circle-radius': ['step', ['get', 'point_count'], 13, 25, 17, 100, 22],
      'circle-opacity': 0.9,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff',
    },
  })

  map.addLayer({
    id: OSM_CLUSTER_COUNT_LAYER,
    type: 'symbol',
    source: OSM_SOURCE,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['Open Sans Bold'],
      'text-size': 12,
      'text-allow-overlap': true,
    },
    paint: { 'text-color': '#fff' },
  })

  map.addLayer({
    id: OSM_POINT_LAYER,
    type: 'circle',
    source: OSM_SOURCE,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': colorByCategory,
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 4, 16, 5.5, 19, 9],
      'circle-opacity': 0.95,
      'circle-stroke-width': 1.5,
      'circle-stroke-color': '#fff',
    },
  })

  map.addLayer({
    id: OSM_LABEL_LAYER,
    type: 'symbol',
    source: OSM_SOURCE,
    filter: ['!', ['has', 'point_count']],
    // Los nombres solo cuando hay sitio para leerlos.
    minzoom: 16.5,
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Regular'],
      'text-size': 11,
      'text-anchor': 'top',
      'text-offset': [0, 0.8],
      'text-max-width': 9,
      'text-optional': true,
    },
    paint: {
      'text-color': labelColors(basemap).text,
      'text-halo-color': labelColors(basemap).halo,
      'text-halo-width': 1.4,
    },
  })
}

export function OsmPlacesLayer({ places }: { places: OsmPlace[] }) {
  const { map, basemap } = useMap()

  useEffect(() => {
    const data = toGeoJson(places)

    const apply = () => {
      try {
        const source = map.getSource(OSM_SOURCE) as GeoJSONSource | undefined
        if (source) source.setData(data)
        // Cambiar de mapa base borra las capas propias: hay que reponerlas.
        else addLayers(map, data, basemap)
      } catch {
        // El estilo todavía no está parseado: 'style.load' lo reintentará.
      }
    }

    apply()
    // Se dispara al cargar el estilo y cada vez que se cambia de mapa base.
    map.on('style.load', apply)

    return () => {
      map.off('style.load', apply)
    }
  }, [map, places, basemap])

  // Cursor de mano: avisa de que el punto se puede pinchar.
  useEffect(() => {
    const enter = () => {
      map.getCanvas().style.cursor = 'pointer'
    }
    const leave = () => {
      map.getCanvas().style.cursor = ''
    }

    map.on('mouseenter', OSM_POINT_LAYER, enter)
    map.on('mouseleave', OSM_POINT_LAYER, leave)
    map.on('mouseenter', OSM_CLUSTER_LAYER, enter)
    map.on('mouseleave', OSM_CLUSTER_LAYER, leave)

    return () => {
      map.off('mouseenter', OSM_POINT_LAYER, enter)
      map.off('mouseleave', OSM_POINT_LAYER, leave)
      map.off('mouseenter', OSM_CLUSTER_LAYER, enter)
      map.off('mouseleave', OSM_CLUSTER_LAYER, leave)
      leave()
    }
  }, [map])

  // Limpieza al desmontar: quitar la capa cuando se apaga el interruptor.
  useEffect(() => {
    return () => {
      for (const id of OSM_LAYERS) {
        if (map.getLayer(id)) map.removeLayer(id)
      }
      if (map.getSource(OSM_SOURCE)) map.removeSource(OSM_SOURCE)
    }
  }, [map])

  return null
}
