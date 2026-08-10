import { useState } from 'react'
import { DishForm } from './DishForm'
import { usePhotoUrl } from './photos'
import { Stars } from './Rating'
import { useRestaurants } from './restaurantsContext'
import { averageRating, type Dish, type Restaurant } from './types'

function formatDate(value?: string): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function DishCard({
  dish,
  restaurantId,
  onZoom,
}: {
  dish: Dish
  restaurantId: string
  onZoom: (url: string, alt: string) => void
}) {
  const { removeDish } = useRestaurants()
  const [editing, setEditing] = useState(false)
  const photoUrl = usePhotoUrl(dish.photoId)

  if (editing) {
    return (
      <li className="dish dish--editing">
        <DishForm
          restaurantId={restaurantId}
          dish={dish}
          onDone={() => setEditing(false)}
        />
      </li>
    )
  }

  return (
    <li className="dish">
      {photoUrl ? (
        <button
          type="button"
          className="dish-photo"
          onClick={() => onZoom(photoUrl, dish.name)}
          aria-label={`Ampliar foto de ${dish.name}`}
        >
          <img src={photoUrl} alt={dish.name} />
        </button>
      ) : (
        <span className="dish-photo dish-photo--empty" aria-hidden="true">
          🍽
        </span>
      )}

      <div className="dish-body">
        <div className="dish-title">
          <span className="dish-name">{dish.name}</span>
          {dish.price != null && (
            <span className="dish-price">
              {dish.price.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </span>
          )}
        </div>
        <Stars value={dish.rating} />
        {dish.notes && <p className="dish-notes">{dish.notes}</p>}
        <div className="dish-actions">
          <button type="button" className="link-button" onClick={() => setEditing(true)}>
            Editar
          </button>
          <button
            type="button"
            className="link-button link-button--danger"
            onClick={() => {
              if (confirm(`¿Borrar "${dish.name}"?`)) void removeDish(restaurantId, dish.id)
            }}
          >
            Borrar
          </button>
        </div>
      </div>
    </li>
  )
}

export function RestaurantDetail({
  restaurant,
  onClose,
  onEdit,
}: {
  restaurant: Restaurant
  onClose: () => void
  onEdit: () => void
}) {
  const { removeRestaurant, upsertRestaurant } = useRestaurants()
  const [adding, setAdding] = useState(false)
  const [zoomed, setZoomed] = useState<{ url: string; alt: string } | null>(null)

  const average = averageRating(restaurant)
  const visitedOn = formatDate(restaurant.visitedAt)
  const wishlist = restaurant.status === 'wishlist'

  return (
    <div className="detail">
      <header className="panel-header">
        <div className="detail-heading">
          <h2>{restaurant.name}</h2>
          <div className="detail-meta">
            {wishlist ? (
              <span className="badge badge--wishlist">🔖 Quiero ir</span>
            ) : average !== null ? (
              <>
                <strong className="detail-score">
                  {average.toFixed(1).replace('.', ',')}
                </strong>
                <Stars value={average} />
                <span className="detail-count">
                  {restaurant.dishes.length}{' '}
                  {restaurant.dishes.length === 1 ? 'plato' : 'platos'}
                </span>
              </>
            ) : (
              <span className="badge">Visitado · sin platos aún</span>
            )}
          </div>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </header>

      <div className="panel-body">
        {restaurant.address && <p className="detail-line">📍 {restaurant.address}</p>}
        {restaurant.cuisine && <p className="detail-line">🍴 {restaurant.cuisine}</p>}
        {visitedOn && <p className="detail-line">📅 Visitado el {visitedOn}</p>}
        {restaurant.notes && <p className="detail-notes">{restaurant.notes}</p>}

        <div className="detail-buttons">
          <button type="button" className="button" onClick={onEdit}>
            Editar
          </button>
          {wishlist && (
            <button
              type="button"
              className="button"
              onClick={() => {
                void upsertRestaurant({
                  ...restaurant,
                  status: 'visited',
                  visitedAt: new Date().toISOString().slice(0, 10),
                })
                setAdding(true)
              }}
            >
              Ya he ido
            </button>
          )}
          <a
            className="button"
            href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            Cómo llegar
          </a>
          <button
            type="button"
            className="button button--danger"
            onClick={() => {
              if (confirm(`¿Borrar "${restaurant.name}" y todos sus platos?`)) {
                void removeRestaurant(restaurant.id)
                onClose()
              }
            }}
          >
            Borrar
          </button>
        </div>

        <section className="dishes">
          <h3 className="section-title">Platos</h3>
          {restaurant.dishes.length === 0 && !adding && (
            <p className="empty-hint">
              Aún no has apuntado ningún plato aquí.
            </p>
          )}

          <ul className="dish-list">
            {restaurant.dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                restaurantId={restaurant.id}
                onZoom={(url, alt) => setZoomed({ url, alt })}
              />
            ))}
          </ul>

          {adding ? (
            <div className="dish dish--editing">
              <DishForm restaurantId={restaurant.id} onDone={() => setAdding(false)} />
            </div>
          ) : (
            <button
              type="button"
              className="button button--primary button--block"
              onClick={() => setAdding(true)}
            >
              + Añadir plato
            </button>
          )}
        </section>
      </div>

      {zoomed && (
        <div
          className="lightbox"
          role="dialog"
          aria-label={zoomed.alt}
          onClick={() => setZoomed(null)}
        >
          <img src={zoomed.url} alt={zoomed.alt} />
        </div>
      )}
    </div>
  )
}
