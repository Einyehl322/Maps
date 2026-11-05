import type { Point } from 'geojson'
import type { GeoJSONSource, MapMouseEvent } from 'maplibre-gl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAccount } from '../auth/accountContext'
import { BasemapSwitcher } from '../map/BasemapSwitcher'
import { useMap } from '../map/mapContext'
import { SearchBox } from '../map/SearchBox'
import { reverseGeocode } from '../map/useGeocoder'
import { OsmControl } from '../osm/OsmControl'
import {
  osmHitLayers,
  OSM_CLUSTER_LAYER,
  OSM_POINT_LAYER,
  OSM_SOURCE,
} from '../osm/layers'
import { OsmPlacesLayer } from '../osm/OsmPlacesLayer'
import { useOsmPlaces } from '../osm/useOsmPlaces'
import {
  draftFromRestaurant,
  emptyDraft,
  type RestaurantDraft,
} from '../restaurants/draft'
import { LIMA_RECOMMENDATIONS } from '../restaurants/lima'
import { RecommendationMarkers } from '../restaurants/RecommendationMarkers'
import { Recommendations } from '../restaurants/Recommendations'
import { Diary } from '../restaurants/Diary'
import { RestaurantDetail } from '../restaurants/RestaurantDetail'
import { RestaurantForm } from '../restaurants/RestaurantForm'
import { RestaurantList } from '../restaurants/RestaurantList'
import { RestaurantMarkers } from '../restaurants/RestaurantMarkers'
import { formatSoles, spendingOf } from '../restaurants/price'
import { useRestaurants } from '../restaurants/restaurantsContext'
import type { Restaurant } from '../restaurants/types'
import { TempMarker } from './TempMarker'
import './app.css'
import { today } from '../lib/dates'

type Place = {
  lng: number
  lat: number
  name: string
  address: string
  loading: boolean
  /** Si salió de la búsqueda de locales de OpenStreetMap. */
  osmId?: string
  cuisine?: string
}

/** Dos vistas en el panel: lo tuyo y la guía de Lima. */
type View = 'mine' | 'guide'

const OSM_KEY = 'maps:osm'

function loadOsmEnabled(): boolean {
  return localStorage.getItem(OSM_KEY) !== 'off'
}

export function AppShell() {
  const { map } = useMap()
  const { restaurants, error } = useRestaurants()
  const account = useAccount()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<RestaurantDraft | null>(null)
  const [place, setPlace] = useState<Place | null>(null)
  const [view, setView] = useState<View>('mine')
  const [recId, setRecId] = useState<string | null>(null)
  const [osmEnabled, setOsmEnabled] = useState(loadOsmEnabled)
  const [diaryOpen, setDiaryOpen] = useState(false)

  const { places: osmPlaces, status: osmStatus } = useOsmPlaces(map, osmEnabled)

  const selected = restaurants.find((item) => item.id === selectedId) ?? null

  // Lo que ya tienes guardado no se repite en la capa: tu pin manda.
  const savedOsmIds = useMemo(
    () =>
      new Set(
        restaurants
          .map((item) => item.osmId)
          .filter((osmId): osmId is string => Boolean(osmId)),
      ),
    [restaurants],
  )

  const visibleOsmPlaces = useMemo(
    () => osmPlaces.filter((item) => !savedOsmIds.has(item.id)),
    [osmPlaces, savedOsmIds],
  )

  const toggleOsm = (next: boolean) => {
    setOsmEnabled(next)
    try {
      localStorage.setItem(OSM_KEY, next ? 'on' : 'off')
    } catch {
      // Sin localStorage el ajuste simplemente no se recuerda.
    }
  }

  const focus = (restaurant: Restaurant) => {
    setPlace(null)
    setDraft(null)
    setRecId(null)
    setSelectedId(restaurant.id)
    map.flyTo({
      center: [restaurant.lng, restaurant.lat],
      zoom: Math.max(map.getZoom(), 16),
      duration: 800,
    })
  }

  // El manejador del clic vive fuera del render, pero necesita datos frescos.
  const clickContextRef = useRef({ restaurants, focus })
  clickContextRef.current = { restaurants, focus }

  /**
   * Clic en el mapa. Tres desenlaces, en este orden:
   * un grupo de locales se abre acercando, un local de OSM abre el formulario
   * con sus datos, y el suelo pelado abre el formulario en blanco.
   */
  useEffect(() => {
    const handleClick = (event: MapMouseEvent) => {
      const layers = osmHitLayers(map)
      const hit = layers.length
        ? map.queryRenderedFeatures(event.point, { layers })[0]
        : undefined

      if (hit?.layer.id === OSM_CLUSTER_LAYER) {
        const source = map.getSource(OSM_SOURCE) as GeoJSONSource | undefined
        const clusterId = hit.properties.cluster_id
        if (!source || typeof clusterId !== 'number') return
        void source.getClusterExpansionZoom(clusterId).then((zoom) => {
          const [lng, lat] = (hit.geometry as Point).coordinates
          map.easeTo({ center: [lng, lat], zoom, duration: 500 })
        })
        return
      }

      setSelectedId(null)
      setRecId(null)

      if (hit?.layer.id === OSM_POINT_LAYER) {
        const props = hit.properties
        const osmId = String(props.id)

        // Si ya lo tenías guardado, se abre tu ficha en vez de duplicarlo.
        const { restaurants: saved, focus: goTo } = clickContextRef.current
        const existing = saved.find((item) => item.osmId === osmId)
        if (existing) {
          goTo(existing)
          return
        }

        const [lng, lat] = (hit.geometry as Point).coordinates
        setPlace(null)
        setDraft(
          emptyDraft(lng, lat, {
            osmId,
            name: String(props.name ?? ''),
            address: String(props.address ?? ''),
            cuisine: String(props.cuisine ?? ''),
            website: String(props.website ?? ''),
            status: 'wishlist',
            visitedAt: today(),
          }),
        )
        return
      }

      const { lng, lat } = event.lngLat
      setPlace({ lng, lat, name: '', address: '', loading: true })
      setDraft(emptyDraft(lng, lat, { status: 'wishlist', visitedAt: today() }))

      void reverseGeocode(lng, lat).then((info) => {
        setPlace((prev) =>
          prev && prev.lng === lng && prev.lat === lat
            ? {
                ...prev,
                name: info?.name ?? '',
                address: info?.address ?? '',
                loading: false,
              }
            : prev,
        )
      })
    }

    map.on('click', handleClick)
    return () => {
      map.off('click', handleClick)
    }
  }, [map])

  const panel = () => {
    if (draft) {
      const matchesPlace =
        place && place.lng === draft.lng && place.lat === draft.lat
      return (
        <RestaurantForm
          key={draft.id ?? `${draft.lng},${draft.lat}`}
          draft={draft}
          suggestion={matchesPlace ? place : null}
          onCancel={() => {
            setDraft(null)
            setPlace(null)
          }}
          onSaved={(saved) => {
            setDraft(null)
            setPlace(null)
            setSelectedId(saved.id)
          }}
        />
      )
    }

    if (selected) {
      return (
        <RestaurantDetail
          restaurant={selected}
          onClose={() => setSelectedId(null)}
          onEdit={() => setDraft(draftFromRestaurant(selected))}
        />
      )
    }

    // El diario se abre tocando el corazón de la cabecera: no tiene botón visible.
    if (diaryOpen) {
      return <Diary onClose={() => setDiaryOpen(false)} onSelect={focus} />
    }

    return (
      <div className="views">
        <Brand restaurants={restaurants} onOpenDiary={() => setDiaryOpen(true)} />
        <div className="view-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'mine'}
            className={`view-tab${view === 'mine' ? ' is-active' : ''}`}
            onClick={() => setView('mine')}
          >
            Nuestro mapa
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'guide'}
            className={`view-tab${view === 'guide' ? ' is-active' : ''}`}
            onClick={() => setView('guide')}
          >
            Dónde comer en Lima
          </button>
        </div>

        {view === 'mine' ? (
          <RestaurantList onSelect={focus} onExplore={() => setView('guide')} />
        ) : (
          <Recommendations
            activeId={recId}
            onActivate={(rec) => {
              setSelectedId(null)
              setPlace(null)
              setRecId(rec?.id ?? null)
            }}
            onSaved={(saved) => {
              setRecId(null)
              setView('mine')
              setSelectedId(saved.id)
              map.flyTo({
                center: [saved.lng, saved.lat],
                zoom: Math.max(map.getZoom(), 16),
                duration: 600,
              })
            }}
          />
        )}
      </div>
    )
  }

  return (
    <>
      {osmEnabled && <OsmPlacesLayer places={visibleOsmPlaces} />}

      {view === 'guide' && !draft && !selected && (
        <RecommendationMarkers
          recommendations={LIMA_RECOMMENDATIONS}
          activeId={recId}
          onSelect={(rec) => {
            setSelectedId(null)
            setPlace(null)
            setRecId(rec.id)
            map.flyTo({ center: [rec.lng, rec.lat], zoom: 16.5, duration: 800 })
          }}
        />
      )}

      <RestaurantMarkers
        restaurants={restaurants}
        selectedId={selectedId}
        onSelect={(id) => {
          const restaurant = restaurants.find((item) => item.id === id)
          if (restaurant) focus(restaurant)
        }}
      />

      {place && !draft && <TempMarker lng={place.lng} lat={place.lat} />}
      {draft && !draft.id && <TempMarker lng={draft.lng} lat={draft.lat} />}

      <div className="panel">
        <SearchBox
          onSelect={(result) => {
            setSelectedId(null)
            setDraft(null)
            setPlace({
              lng: result.center[0],
              lat: result.center[1],
              name: result.name,
              address: result.osmId ? (result.address ?? '') : result.detail,
              loading: false,
              osmId: result.osmId,
              cuisine: result.cuisine,
            })
          }}
        />

        {place && !draft && !selected && (
          <div className="panel-card place-card">
            <div className="place-info">
              <strong className="place-name">
                {place.loading && !place.name
                  ? 'Buscando qué hay aquí…'
                  : place.name || 'Punto sin nombre'}
              </strong>
              <span className="place-address">
                {[place.cuisine, place.address].filter(Boolean).join(' · ') ||
                  `${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}`}
              </span>
            </div>
            <div className="place-actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() =>
                  setDraft(
                    emptyDraft(place.lng, place.lat, {
                      name: place.name,
                      address: place.address,
                      osmId: place.osmId,
                      cuisine: place.cuisine ?? '',
                      status: 'visited',
                      visitedAt: today(),
                    }),
                  )
                }
              >
                Ya fuimos
              </button>
              <button
                type="button"
                className="button"
                onClick={() =>
                  setDraft(
                    emptyDraft(place.lng, place.lat, {
                      name: place.name,
                      address: place.address,
                      osmId: place.osmId,
                      cuisine: place.cuisine ?? '',
                      status: 'wishlist',
                    }),
                  )
                }
              >
                Queremos ir
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => setPlace(null)}
                aria-label="Descartar"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="panel-error" role="alert">
            {error}
          </div>
        )}

        <div className="panel-card panel-main">
          {panel()}
          {account && !draft && !selected && (
            <div className="account-bar">
              <span>Conectado como {account.email}</span>
              <button type="button" className="link-button" onClick={account.signOut}>
                Salir
              </button>
            </div>
          )}
        </div>
      </div>

      <OsmControl
        enabled={osmEnabled}
        onToggle={toggleOsm}
        status={osmStatus}
        count={visibleOsmPlaces.length}
      />

      <BasemapSwitcher />
    </>
  )
}

function Brand({
  restaurants,
  onOpenDiary,
}: {
  restaurants: Restaurant[]
  onOpenDiary: () => void
}) {
  const visited = restaurants.filter((item) => item.status === 'visited').length
  const spent = spendingOf(restaurants.flatMap((item) => item.dishes)).total
  const photos = restaurants.reduce((sum, item) => sum + (item.photoIds?.length ?? 0), 0)

  const facts = [
    `${visited} ${visited === 1 ? 'lugar juntos' : 'lugares juntos'}`,
    photos > 0 && `${photos} ${photos === 1 ? 'foto' : 'fotos'}`,
    spent > 0 && `${formatSoles(spent, true)} en comida`,
  ].filter(Boolean)

  return (
    <header className="brand">
      <button
        type="button"
        className="brand-mark"
        onClick={onOpenDiary}
        aria-label="Abrir nuestro diario"
      >
        ♥
      </button>
      <div className="brand-text">
        <h1>Nuestros lugares</h1>
        <p>{restaurants.length === 0 ? 'Nuestro mapa de Lima' : facts.join(' · ')}</p>
      </div>
    </header>
  )
}
