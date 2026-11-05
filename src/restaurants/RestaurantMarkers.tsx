import { Marker } from 'maplibre-gl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMap } from '../map/mapContext'
import { photoUrl } from './photos'
import { averageRating, type Restaurant } from './types'

/**
 * Por debajo de esta cantidad se pintan todos: son marcadores DOM y con pocos
 * no cuesta nada. A partir de aquí, solo los que caen en pantalla.
 */
const CULL_FROM = 120

/** Margen alrededor de la vista, para que no aparezcan de golpe al arrastrar. */
const PADDING = 0.25

function formatScore(value: number): string {
  return value.toFixed(1)
}

function createPin(restaurant: Restaurant): HTMLButtonElement {
  const average = averageRating(restaurant)
  const wishlist = restaurant.status === 'wishlist'
  const cover = wishlist ? undefined : restaurant.photoIds?.[0]

  const element = document.createElement('button')
  element.type = 'button'
  element.className = `pin${wishlist ? ' pin--wishlist' : ''}`
  element.title = restaurant.name
  element.setAttribute(
    'aria-label',
    wishlist
      ? `${restaurant.name} (pendiente)`
      : `${restaurant.name}${average === null ? '' : `, ${formatScore(average)} de 5`}`,
  )

  if (cover) {
    // Con foto: el pin es la foto, y la nota va en una etiqueta.
    const photo = document.createElement('span')
    photo.className = 'pin-photo'
    element.append(photo)
    void photoUrl(cover).then((url) => {
      if (url) photo.style.backgroundImage = `url("${url}")`
    })
    if (average !== null) {
      const score = document.createElement('span')
      score.className = 'pin-score'
      score.textContent = formatScore(average)
      element.append(score)
    }
    return element
  }

  const body = document.createElement('span')
  body.className = 'pin-body'
  if (wishlist) body.textContent = '🔖'
  else if (average === null) body.textContent = '♥'
  else body.textContent = formatScore(average)
  element.append(body)

  return element
}

export function RestaurantMarkers({
  restaurants,
  selectedId,
  onSelect,
}: {
  restaurants: Restaurant[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const { map } = useMap()
  const markersRef = useRef(new globalThis.Map<string, Marker>())
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Ventana actual: cambia al soltar el mapa, no durante el arrastre.
  const [view, setView] = useState<[number, number, number, number] | null>(null)

  useEffect(() => {
    const update = () => {
      const bounds = map.getBounds()
      setView([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ])
    }

    update()
    map.on('moveend', update)
    return () => {
      map.off('moveend', update)
    }
  }, [map])

  const visible = useMemo(() => {
    if (!view || restaurants.length < CULL_FROM) return restaurants

    const [west, south, east, north] = view
    const padX = (east - west) * PADDING
    const padY = (north - south) * PADDING

    return restaurants.filter(
      (item) =>
        item.lng >= west - padX &&
        item.lng <= east + padX &&
        item.lat >= south - padY &&
        item.lat <= north + padY,
    )
  }, [restaurants, view])

  useEffect(() => {
    const markers = markersRef.current
    const seen = new Set<string>()

    for (const restaurant of visible) {
      seen.add(restaurant.id)
      markers.get(restaurant.id)?.remove()

      const element = createPin(restaurant)
      element.addEventListener('click', (event) => {
        event.stopPropagation()
        onSelectRef.current(restaurant.id)
      })

      markers.set(
        restaurant.id,
        new Marker({ element, anchor: 'bottom' })
          .setLngLat([restaurant.lng, restaurant.lat])
          .addTo(map),
      )
    }

    for (const [id, marker] of markers) {
      if (!seen.has(id)) {
        marker.remove()
        markers.delete(id)
      }
    }
  }, [visible, map])

  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      marker.getElement().classList.toggle('is-selected', id === selectedId)
    }
  }, [selectedId, visible])

  useEffect(() => {
    const markers = markersRef.current
    return () => {
      for (const marker of markers.values()) marker.remove()
      markers.clear()
    }
  }, [])

  return null
}
