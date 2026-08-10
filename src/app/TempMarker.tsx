import { Marker } from 'maplibre-gl'
import { useEffect } from 'react'
import { useMap } from '../map/mapContext'

/** Marcador provisional del sitio que estás a punto de guardar. */
export function TempMarker({ lng, lat }: { lng: number; lat: number }) {
  const { map } = useMap()

  useEffect(() => {
    const element = document.createElement('div')
    element.className = 'pin pin--temp'
    const body = document.createElement('span')
    body.className = 'pin-body'
    body.textContent = '+'
    element.append(body)

    const marker = new Marker({ element, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(map)

    return () => {
      marker.remove()
    }
  }, [lng, lat, map])

  return null
}
