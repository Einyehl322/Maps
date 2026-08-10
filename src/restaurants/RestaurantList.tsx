import { useState } from 'react'
import { Stars } from './Rating'
import { useRestaurants } from './restaurantsContext'
import { averageRating, ratingColor, type Restaurant } from './types'

type Filter = 'all' | 'visited' | 'wishlist'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'visited', label: 'Visitados' },
  { id: 'wishlist', label: 'Quiero ir' },
]

export function RestaurantList({
  onSelect,
  onExplore,
}: {
  onSelect: (restaurant: Restaurant) => void
  onExplore: () => void
}) {
  const { restaurants, ready, loadDemo } = useRestaurants()
  const [filter, setFilter] = useState<Filter>('all')
  const [term, setTerm] = useState('')

  const needle = term.trim().toLowerCase()
  const visible = restaurants.filter((restaurant) => {
    if (filter !== 'all' && restaurant.status !== filter) return false
    if (!needle) return true
    return [
      restaurant.name,
      restaurant.address,
      restaurant.cuisine,
      ...restaurant.dishes.map((dish) => dish.name),
    ]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(needle))
  })

  const counts = {
    all: restaurants.length,
    visited: restaurants.filter((item) => item.status === 'visited').length,
    wishlist: restaurants.filter((item) => item.status === 'wishlist').length,
  }

  if (!ready) {
    return <p className="empty-hint panel-body">Cargando…</p>
  }

  if (restaurants.length === 0) {
    return (
      <div className="panel-body empty-state">
        <p className="empty-title">Tu mapa está vacío</p>
        <p className="empty-hint">
          Busca un sitio arriba, o haz <strong>clic en cualquier punto del mapa</strong>{' '}
          para guardar un restaurante: los que ya has probado y los que quieres probar.
        </p>
        <button type="button" className="button button--block button--primary" onClick={onExplore}>
          Ver dónde comer en Lima
        </button>
        <button type="button" className="button button--block" onClick={() => void loadDemo()}>
          Empezar con 6 clásicos limeños
        </button>
      </div>
    )
  }

  return (
    <div className="list">
      <div className="list-head">
        <div className="tabs" role="tablist">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={`tab${filter === item.id ? ' is-active' : ''}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
              <span className="tab-count">{counts[item.id]}</span>
            </button>
          ))}
        </div>
        <input
          className="input input--filter"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Filtrar por nombre, cocina o plato"
          aria-label="Filtrar mis restaurantes"
        />
      </div>

      <ul className="list-items">
        {visible.length === 0 && (
          <li className="empty-hint">Nada coincide con ese filtro.</li>
        )}
        {visible.map((restaurant) => {
          const average = averageRating(restaurant)
          const wishlist = restaurant.status === 'wishlist'
          return (
            <li key={restaurant.id}>
              <button
                type="button"
                className="list-item"
                onClick={() => onSelect(restaurant)}
              >
                <span
                  className="list-badge"
                  style={{ background: wishlist ? '#5f6368' : ratingColor(average) }}
                >
                  {wishlist ? '🔖' : average === null ? '🍽' : average.toFixed(1).replace('.', ',')}
                </span>
                <span className="list-text">
                  <span className="list-name">{restaurant.name}</span>
                  <span className="list-sub">
                    {wishlist
                      ? 'Pendiente de visitar'
                      : average !== null
                        ? `${restaurant.dishes.length} ${restaurant.dishes.length === 1 ? 'plato' : 'platos'}`
                        : 'Visitado'}
                    {restaurant.cuisine ? ` · ${restaurant.cuisine}` : ''}
                  </span>
                  {average !== null && <Stars value={average} size={12} />}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
