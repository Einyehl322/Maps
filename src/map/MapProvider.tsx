import {
  GeolocateControl,
  MapLibreMap,
  NavigationControl,
  ScaleControl,
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BASEMAPS, DEFAULT_BASEMAP, isBasemapId, type BasemapId } from './basemaps'
import { MapContext } from './mapContext'
import './map.css'

const CAMERA_KEY = 'maps:camera'
const BASEMAP_KEY = 'maps:basemap'

type Camera = {
  center: [number, number]
  zoom: number
  bearing: number
  pitch: number
}

/** Lima: solo se usa la primera vez, antes de geolocalizar o de mover el mapa. */
const DEFAULT_CAMERA: Camera = {
  center: [-77.0345, -12.0553],
  zoom: 12,
  bearing: 0,
  pitch: 0,
}

function loadCamera(): Camera | null {
  try {
    const raw = localStorage.getItem(CAMERA_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const { center, zoom, bearing, pitch } = parsed as Partial<Camera>
    if (
      !Array.isArray(center) ||
      center.length !== 2 ||
      typeof center[0] !== 'number' ||
      typeof center[1] !== 'number' ||
      typeof zoom !== 'number'
    ) {
      return null
    }
    return {
      center: [center[0], center[1]],
      zoom,
      bearing: typeof bearing === 'number' ? bearing : 0,
      pitch: typeof pitch === 'number' ? pitch : 0,
    }
  } catch {
    return null
  }
}

function loadBasemap(): BasemapId {
  const saved = localStorage.getItem(BASEMAP_KEY)
  return isBasemapId(saved) ? saved : DEFAULT_BASEMAP
}

export function MapProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const appliedBasemapRef = useRef<BasemapId | null>(null)
  const [map, setMap] = useState<MapLibreMap | null>(null)
  const [basemap, setBasemap] = useState<BasemapId>(loadBasemap)

  // Ciclo de vida del mapa: se crea una sola vez.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const savedCamera = loadCamera()
    const camera = savedCamera ?? DEFAULT_CAMERA
    const initialBasemap = loadBasemap()
    appliedBasemapRef.current = initialBasemap

    const instance = new MapLibreMap({
      container,
      style: BASEMAPS[initialBasemap].style,
      center: camera.center,
      zoom: camera.zoom,
      bearing: camera.bearing,
      pitch: camera.pitch,
      maxPitch: 75,
      attributionControl: { compact: true },
      // Rotación e inclinación con botón derecho / dos dedos, como Google Maps.
      dragRotate: true,
      pitchWithRotate: true,
    })

    instance.addControl(
      new NavigationControl({ visualizePitch: true, showCompass: true }),
      'bottom-right',
    )

    const geolocate = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true,
      showAccuracyCircle: true,
    })
    instance.addControl(geolocate, 'bottom-right')

    instance.addControl(
      new ScaleControl({ maxWidth: 120, unit: 'metric' }),
      'bottom-left',
    )

    // Recordar la cámara entre recargas.
    const persistCamera = () => {
      const center = instance.getCenter()
      const next: Camera = {
        center: [center.lng, center.lat],
        zoom: instance.getZoom(),
        bearing: instance.getBearing(),
        pitch: instance.getPitch(),
      }
      try {
        localStorage.setItem(CAMERA_KEY, JSON.stringify(next))
      } catch {
        // localStorage lleno o bloqueado: no es crítico.
      }
    }
    instance.on('moveend', persistCamera)

    instance.once('load', () => {
      // Primera visita: centrar en el usuario si da permiso.
      if (!savedCamera) geolocate.trigger()
    })

    mapRef.current = instance
    setMap(instance)

    return () => {
      instance.off('moveend', persistCamera)
      instance.remove()
      mapRef.current = null
      appliedBasemapRef.current = null
      setMap(null)
    }
  }, [])

  // Cambio de mapa base sin recrear la instancia (los marcadores DOM sobreviven).
  useEffect(() => {
    const instance = mapRef.current
    if (!instance) return
    if (appliedBasemapRef.current === basemap) return
    appliedBasemapRef.current = basemap
    instance.setStyle(BASEMAPS[basemap].style)
    try {
      localStorage.setItem(BASEMAP_KEY, basemap)
    } catch {
      // ignorar
    }
  }, [basemap, map])

  return (
    <MapContext.Provider value={map ? { map, basemap, setBasemap } : null}>
      <div className="map-root">
        <div className="map-canvas" ref={containerRef} />
        {map && <div className="map-overlay">{children}</div>}
      </div>
    </MapContext.Provider>
  )
}
