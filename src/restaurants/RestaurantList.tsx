import { useState } from 'react'
import { foodCategoryInfo, FOOD_CATEGORIES, placeFoodCategory, type FoodCategory } from './food'
import { usePhotoUrl } from './photos'
import { priceMark } from './price'
import { useRestaurants } from './restaurantsContext'
import { averageRating, type Restaurant } from './types'

type Filter = 'all' | 'visited' | 'wishlist'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'visited', label: 'Fuimos' },
  { id: 'wishlist', label: 'Queremos ir' },
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
  const [food, setFood] = useState<FoodCategory | 'all'>('all')

  const needle = term.trim().toLowerCase()
  const visible = restaurants.filter((restaurant) => {
    if (filter !== 'all' && restaurant.status !== filter) return false
    if (food !== 'all' && placeFoodCategory(restaurant) !== food) return false
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

  // Solo las categorías que tienen algún lugar, en el orden de siempre.
  const usedCategories = new Set(restaurants.map(placeFoodCategory))
  const foodChips = FOOD_CATEGORIES.filter((info) => usedCategories.has(info.id))


  if (!ready) {
    return <p className="empty-hint panel-body">Cargando…</p>
  }

  if (restaurants.length === 0) {
    return (
      <div className="panel-body empty-state">
        <p className="empty-title">Su mapa está vacío</p>
        <p className="empty-hint">
          Busca un sitio arriba, o toca <strong>cualquier punto del mapa</strong>{' '}
          para guardar un lugar: donde ya fueron juntos y donde quieren ir.
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
            </button>
          ))}
        </div>
        {foodChips.length > 1 && (
          <div className="chips" role="group" aria-label="Filtrar por categoría">
            <button
              type="button"
              className={`chip${food === 'all' ? ' is-active' : ''}`}
              onClick={() => setFood('all')}
            >
              Todas
            </button>
            {foodChips.map((info) => (
              <button
                key={info.id}
                type="button"
                className={`chip${food === info.id ? ' is-active' : ''}`}
                onClick={() => setFood(food === info.id ? 'all' : info.id)}
              >
                {info.emoji} {info.label}
              </button>
            ))}
          </div>
        )}
        <input
          type="search"
          className="input input--filter"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Filtrar por nombre, tipo o plato"
          aria-label="Filtrar nuestros lugares"
        />
      </div>

      <ul className="list-items">
        {visible.length === 0 && (
          <li className="empty-hint">Nada coincide con ese filtro.</li>
        )}
        {visible.map((restaurant) => (
          <li key={restaurant.id}>
            <ListItem restaurant={restaurant} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function ListItem({
  restaurant,
  onSelect,
}: {
  restaurant: Restaurant
  onSelect: (restaurant: Restaurant) => void
}) {
  const thumb = usePhotoUrl(restaurant.photoIds?.[0])
  const average = averageRating(restaurant)
  const wishlist = restaurant.status === 'wishlist'
  const visitedOn = shortDay(restaurant.visitedAt)

  const sub = [
    wishlist ? 'Pendiente' : visitedOn ? `Fuimos el ${visitedOn}` : 'Fuimos',
    restaurant.cuisine,
    restaurant.priceLevel && priceMark(restaurant.priceLevel),
  ].filter(Boolean)

  return (
    <button type="button" className="list-item" onClick={() => onSelect(restaurant)}>
      <span
        className={`list-thumb${wishlist ? ' list-thumb--wish' : ''}`}
        style={thumb ? { backgroundImage: `url("${thumb}")` } : undefined}
        aria-hidden="true"
      >
        {!thumb && foodCategoryInfo(placeFoodCategory(restaurant)).emoji}
      </span>
      <span className="list-text">
        <span className="list-name">{restaurant.name}</span>
        <span className="list-sub">{sub.join(' · ')}</span>
      </span>
      {average !== null && (
        <span className="list-score">
          ★ {average.toFixed(1)}
        </span>
      )}
    </button>
  )
}

/** "12 jul" a partir de `yyyy-mm-dd`. */
function shortDay(value?: string): string | null {
  const match = value && /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return null
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    .toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
}
