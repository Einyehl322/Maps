import { useMemo, useState } from 'react'
import { useMap } from '../map/mapContext'
import {
  categoryOf,
  LIMA_RECOMMENDATIONS,
  PRICE_LABELS,
  priceMark,
  REC_CATEGORIES,
  type RecCategory,
  type Recommendation,
} from './lima'
import { useRestaurants } from './restaurantsContext'
import { newId, type Restaurant, type RestaurantStatus } from './types'
import { today } from '../lib/dates'

/** Guía cerrada de sitios de Lima: se consulta y, si te convence, se copia a tu mapa. */
export function Recommendations({
  activeId,
  onActivate,
  onSaved,
}: {
  activeId: string | null
  onActivate: (rec: Recommendation | null) => void
  onSaved: (restaurant: Restaurant) => void
}) {
  const { map } = useMap()
  const { restaurants, upsertRestaurant } = useRestaurants()
  const [category, setCategory] = useState<RecCategory | 'all'>('all')
  const [term, setTerm] = useState('')

  // Qué recomendaciones ya están en tu mapa: rec.id -> id del restaurante guardado.
  const saved = useMemo(() => {
    const index = new globalThis.Map<string, string>()
    for (const restaurant of restaurants) {
      if (restaurant.recId) index.set(restaurant.recId, restaurant.id)
    }
    return index
  }, [restaurants])

  const needle = term.trim().toLowerCase()
  const visible = LIMA_RECOMMENDATIONS.filter((rec) => {
    if (category !== 'all' && rec.category !== category) return false
    if (!needle) return true
    return [rec.name, rec.district, rec.address, rec.about, ...rec.dishes].some(
      (value) => value.toLowerCase().includes(needle),
    )
  })

  const active = LIMA_RECOMMENDATIONS.find((rec) => rec.id === activeId) ?? null

  const focus = (rec: Recommendation) => {
    onActivate(rec)
    map.flyTo({ center: [rec.lng, rec.lat], zoom: 16.5, duration: 800 })
  }

  const save = async (rec: Recommendation, status: RestaurantStatus) => {
    const existing = restaurants.find((item) => item.recId === rec.id)

    // Si ya lo tenías, solo cambia el estado: tus notas y platos no se tocan.
    if (existing) {
      onSaved(
        await upsertRestaurant({
          ...existing,
          status,
          priceLevel: existing.priceLevel ?? rec.price,
          visitedAt:
            status === 'visited'
              ? (existing.visitedAt ?? today())
              : existing.visitedAt,
        }),
      )
      return
    }

    const restaurant = await upsertRestaurant({
      id: newId(),
      recId: rec.id,
      name: rec.name,
      status,
      address: `${rec.address}, ${rec.district}`,
      cuisine: categoryOf(rec.category).cuisine,
      priceLevel: rec.price,
      lng: rec.lng,
      lat: rec.lat,
      visitedAt: status === 'visited' ? today() : undefined,
      notes: `${rec.about}\n\nQué pedir: ${rec.dishes.join(', ')}.`,
    })
    onSaved(restaurant)
  }

  return (
    <div className="list">
      <div className="list-head">
        <input
          className="input input--filter"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Buscar por plato, zona o nombre"
          aria-label="Buscar en la guía de Lima"
        />
        <div className="chips">
          <button
            type="button"
            className={`chip${category === 'all' ? ' is-active' : ''}`}
            onClick={() => setCategory('all')}
          >
            Todo
          </button>
          {REC_CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip${category === item.id ? ' is-active' : ''}`}
              onClick={() => setCategory(item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span> {item.label}
            </button>
          ))}
        </div>
      </div>

      {active && (
        <RecommendationCard
          rec={active}
          savedId={saved.get(active.id) ?? null}
          onClose={() => onActivate(null)}
          onSave={save}
        />
      )}

      <ul className="list-items">
        {visible.length === 0 && (
          <li className="empty-hint">Nada coincide con esa búsqueda.</li>
        )}
        {visible.map((rec) => {
          const meta = categoryOf(rec.category)
          return (
            <li key={rec.id}>
              <button
                type="button"
                className={`list-item${rec.id === activeId ? ' is-active' : ''}`}
                onClick={() => focus(rec)}
              >
                <span className="list-badge list-badge--rec" aria-hidden="true">
                  {meta.emoji}
                </span>
                <span className="list-text">
                  <span className="list-name">
                    {rec.name}
                    {saved.has(rec.id) && (
                      <span className="list-saved" title="Ya está en tu mapa">
                        ✓
                      </span>
                    )}
                  </span>
                  <span className="list-sub">
                    {rec.district} · {meta.label} · {priceMark(rec.price)}
                  </span>
                  <span className="list-sub">{rec.dishes.slice(0, 2).join(' · ')}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="guide-note">
        {LIMA_RECOMMENDATIONS.length} sitios reales de Lima, ubicados sobre
        OpenStreetMap. Horarios y precios cambian: confírmalos antes de ir.
      </p>
    </div>
  )
}

function RecommendationCard({
  rec,
  savedId,
  onClose,
  onSave,
}: {
  rec: Recommendation
  savedId: string | null
  onClose: () => void
  onSave: (rec: Recommendation, status: RestaurantStatus) => Promise<void>
}) {
  const meta = categoryOf(rec.category)

  return (
    <div className="rec-card">
      <div className="rec-head">
        <div className="detail-heading">
          <h3 className="rec-name">{rec.name}</h3>
          <span className="list-sub">
            {meta.emoji} {meta.label} · {rec.district} · {PRICE_LABELS[rec.price]}
          </span>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </div>

      <p className="detail-line">{rec.address}</p>
      <p className="rec-about">{rec.about}</p>

      <p className="rec-dishes">
        <strong>Qué pedir:</strong> {rec.dishes.join(', ')}.
      </p>

      {rec.approx && (
        <p className="rec-approx">
          Ubicación aproximada: OpenStreetMap no tiene el local, el pin cae sobre su calle.
        </p>
      )}

      <div className="detail-buttons">
        <button
          type="button"
          className="button button--primary"
          onClick={() => void onSave(rec, 'wishlist')}
        >
          {savedId ? 'Marcar como pendiente' : 'Queremos ir'}
        </button>
        <button type="button" className="button" onClick={() => void onSave(rec, 'visited')}>
          Ya fuimos
        </button>
        <a
          className="button"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${rec.name}, ${rec.address}, ${rec.district}, Lima`)}`}
          target="_blank"
          rel="noreferrer"
        >
          Buscar horarios
        </a>
      </div>
    </div>
  )
}
