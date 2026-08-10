import { Marker } from 'maplibre-gl'
import { useEffect, useRef } from 'react'
import { useMap } from '../map/mapContext'
import { categoryOf, type Recommendation } from './lima'

/** Pines de la guía: hueca y con el emoji de la categoría, para no confundirlos con los tuyos. */
function createPin(rec: Recommendation): HTMLButtonElement {
  const meta = categoryOf(rec.category)

  const element = document.createElement('button')
  element.type = 'button'
  element.className = 'pin pin--rec'
  element.title = `${rec.name} · ${meta.label}`
  element.setAttribute('aria-label', `${rec.name}, ${meta.label} en ${rec.district}`)

  const body = document.createElement('span')
  body.className = 'pin-body'
  body.textContent = meta.emoji
  element.append(body)

  return element
}

export function RecommendationMarkers({
  recommendations,
  activeId,
  onSelect,
}: {
  recommendations: Recommendation[]
  activeId: string | null
  onSelect: (rec: Recommendation) => void
}) {
  const { map } = useMap()
  const markersRef = useRef(new globalThis.Map<string, Marker>())
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const markers = markersRef.current
    const seen = new Set<string>()

    for (const rec of recommendations) {
      seen.add(rec.id)
      markers.get(rec.id)?.remove()

      const element = createPin(rec)
      element.addEventListener('click', (event) => {
        event.stopPropagation()
        onSelectRef.current(rec)
      })

      markers.set(
        rec.id,
        new Marker({ element, anchor: 'bottom' }).setLngLat([rec.lng, rec.lat]).addTo(map),
      )
    }

    for (const [id, marker] of markers) {
      if (!seen.has(id)) {
        marker.remove()
        markers.delete(id)
      }
    }
  }, [recommendations, map])

  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      marker.getElement().classList.toggle('is-selected', id === activeId)
    }
  }, [activeId, recommendations])

  useEffect(() => {
    const markers = markersRef.current
    return () => {
      for (const marker of markers.values()) marker.remove()
      markers.clear()
    }
  }, [])

  return null
}
