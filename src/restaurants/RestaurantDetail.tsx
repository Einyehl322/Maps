import { useRef, useState } from 'react'
import { formatDay, today } from '../lib/dates'
import { useOsmDetails } from '../osm/details'
import { DishForm } from './DishForm'
import { usePhotoUrl } from './photos'
import { formatSoles, PRICE_LABELS, priceMark, spendingOf } from './price'
import { QuoteSection } from './QuoteSection'
import { Stars } from './Rating'
import { useRestaurants } from './restaurantsContext'
import { averageRating, type Dish, type Restaurant } from './types'

type Zoom = (url: string, alt: string) => void

function GalleryPhoto({
  photoId,
  alt,
  onZoom,
  onRemove,
}: {
  photoId: string
  alt: string
  onZoom: Zoom
  onRemove: () => void
}) {
  const url = usePhotoUrl(photoId)
  return (
    <li className="gallery-item">
      {url ? (
        <button
          type="button"
          className="gallery-photo"
          onClick={() => onZoom(url, alt)}
          aria-label="Ampliar foto"
        >
          <img src={url} alt={alt} loading="lazy" />
        </button>
      ) : (
        <span className="gallery-photo gallery-photo--loading" aria-hidden="true" />
      )}
      <button
        type="button"
        className="gallery-remove"
        onClick={onRemove}
        aria-label="Borrar foto"
      >
        ✕
      </button>
    </li>
  )
}

function Gallery({ restaurant, onZoom }: { restaurant: Restaurant; onZoom: Zoom }) {
  const { addPhotos, removePhoto } = useRestaurants()
  const [uploading, setUploading] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const photoIds = restaurant.photoIds ?? []

  const upload = async (files: File[]) => {
    if (!files.length) return
    setUploading(files.length)
    try {
      await addPhotos(restaurant.id, files)
    } catch {
      // El error ya se muestra arriba, en el aviso del panel.
    } finally {
      setUploading(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <section className="section">
      <h3 className="section-title">
        Nuestras fotos
        {photoIds.length > 0 && <span className="section-count">{photoIds.length}</span>}
      </h3>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => void upload([...(event.target.files ?? [])])}
      />
      <ul className="gallery">
        {photoIds.map((photoId) => (
          <GalleryPhoto
            key={photoId}
            photoId={photoId}
            alt={restaurant.name}
            onZoom={onZoom}
            onRemove={() => {
              if (confirm('¿Borrar esta foto?')) {
                void removePhoto(restaurant.id, photoId).catch(() => {})
              }
            }}
          />
        ))}
        <li className="gallery-item">
          <button
            type="button"
            className="gallery-add"
            disabled={uploading > 0}
            onClick={() => inputRef.current?.click()}
          >
            <span aria-hidden="true">{uploading > 0 ? '⏳' : '＋'}</span>
            {uploading > 0 ? `Subiendo ${uploading}…` : 'Subir fotos'}
          </button>
        </li>
      </ul>
    </section>
  )
}

function DishCard({
  dish,
  restaurantId,
  onZoom,
}: {
  dish: Dish
  restaurantId: string
  onZoom: Zoom
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
            <span className="dish-price">{formatSoles(dish.price)}</span>
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
              if (confirm(`¿Borrar "${dish.name}"?`)) {
                void removeDish(restaurantId, dish.id).catch(() => {})
              }
            }}
          >
            Borrar
          </button>
        </div>
      </div>
    </li>
  )
}

/** Enlaces al local real: web, redes, teléfono, horario y mapas. */
function Links({ restaurant }: { restaurant: Restaurant }) {
  const live = useOsmDetails(restaurant.osmId)
  const website = restaurant.website ?? live?.website
  const query = [restaurant.name, restaurant.address ?? 'Lima'].join(', ')

  const links = [
    website && { key: 'web', href: website, icon: '🌐', label: linkLabel(website) },
    live?.menu && { key: 'menu', href: live.menu, icon: '📋', label: 'Carta' },
    live?.instagram &&
      website !== live.instagram && {
        key: 'ig',
        href: live.instagram,
        icon: '📷',
        label: 'Instagram',
      },
    live?.facebook && { key: 'fb', href: live.facebook, icon: '👍', label: 'Facebook' },
    live?.phone && {
      key: 'tel',
      href: `tel:${live.phone.replace(/[^\d+]/g, '')}`,
      icon: '📞',
      label: live.phone,
    },
    {
      key: 'gmaps',
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      icon: '📍',
      label: 'Google Maps',
    },
    restaurant.osmId && {
      key: 'osm',
      href: `https://www.openstreetmap.org/${restaurant.osmId}`,
      icon: '🗺',
      label: 'OpenStreetMap',
    },
  ].filter(Boolean) as { key: string; href: string; icon: string; label: string }[]

  return (
    <div className="links">
      {live?.openingHours && <p className="detail-line">🕒 {live.openingHours}</p>}
      <div className="link-chips">
        {links.map((link) => (
          <a
            key={link.key}
            className="link-chip"
            href={link.href}
            target={link.key === 'tel' ? undefined : '_blank'}
            rel="noreferrer"
          >
            <span aria-hidden="true">{link.icon}</span>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}

/** "instagram.com/larco" → "Instagram"; cualquier otra web → su dominio. */
function linkLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (host.endsWith('instagram.com')) return 'Instagram'
    if (host.endsWith('facebook.com')) return 'Facebook'
    if (host.endsWith('tiktok.com')) return 'TikTok'
    return host
  } catch {
    return 'Sitio web'
  }
}

function Hero({ restaurant, onClose }: { restaurant: Restaurant; onClose: () => void }) {
  const cover = usePhotoUrl(restaurant.photoIds?.[0])
  const wishlist = restaurant.status === 'wishlist'

  return (
    <div
      className={`hero${cover ? ' hero--photo' : ''}${wishlist ? ' hero--wish' : ''}`}
      style={cover ? { backgroundImage: `url("${cover}")` } : undefined}
    >
      {!cover && (
        <span className="hero-emoji" aria-hidden="true">
          {wishlist ? '🔖' : '♥'}
        </span>
      )}
      <button type="button" className="hero-close" onClick={onClose} aria-label="Cerrar">
        ✕
      </button>
      <div className="hero-text">
        <span className="hero-kicker">
          {wishlist ? 'Queremos ir' : 'Fuimos juntos'}
          {restaurant.cuisine && ` · ${restaurant.cuisine}`}
        </span>
        <h2>{restaurant.name}</h2>
      </div>
    </div>
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
  const spending = spendingOf(restaurant.dishes)
  const visitedOn = formatDay(restaurant.visitedAt)
  const wishlist = restaurant.status === 'wishlist'
  const zoom: Zoom = (url, alt) => setZoomed({ url, alt })

  const stats = [
    !wishlist &&
      average !== null && {
        key: 'rating',
        value: average.toFixed(1),
        label: <Stars value={average} size={11} />,
      },
    spending.priced > 0 && {
      key: 'spent',
      value: formatSoles(spending.total, true),
      label: spending.unpriced > 0 ? `gastamos (${spending.unpriced} sin precio)` : 'gastamos',
    },
    restaurant.priceLevel && {
      key: 'price',
      value: priceMark(restaurant.priceLevel),
      label: `${PRICE_LABELS[restaurant.priceLevel]} p.p.`,
    },
  ].filter(Boolean) as { key: string; value: string; label: React.ReactNode }[]

  return (
    <div className="detail">
      <Hero restaurant={restaurant} onClose={onClose} />

      <div className="panel-body">
        {stats.length > 0 && (
          <div className="stats">
            {stats.map((stat) => (
              <div key={stat.key} className="stat">
                <strong className="stat-value">{stat.value}</strong>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {(restaurant.address || visitedOn) && (
          <div className="detail-lines">
            {restaurant.address && <p className="detail-line">📍 {restaurant.address}</p>}
            {visitedOn && <p className="detail-line">📅 Fuimos el {visitedOn}</p>}
          </div>
        )}

        {restaurant.message && (
          <figure className="love-note">
            <blockquote>{restaurant.message}</blockquote>
            {restaurant.messageFrom && (
              <figcaption>💌 {restaurant.messageFrom.split('@')[0]}</figcaption>
            )}
          </figure>
        )}

        <Links restaurant={restaurant} />

        {restaurant.notes && <p className="detail-notes">{restaurant.notes}</p>}

        <div className="detail-buttons">
          {wishlist && (
            <button
              type="button"
              className="button button--primary"
              onClick={() => {
                void upsertRestaurant({
                  ...restaurant,
                  status: 'visited',
                  visitedAt: today(),
                }).catch(() => {})
                setAdding(true)
              }}
            >
              ♥ Ya fuimos
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
          <button type="button" className="button" onClick={onEdit}>
            Editar
          </button>
          <button
            type="button"
            className="button button--ghost-danger"
            onClick={() => {
              if (confirm(`¿Borrar "${restaurant.name}" con sus platos y fotos?`)) {
                void removeRestaurant(restaurant.id)
                  .then(onClose)
                  .catch(() => {})
              }
            }}
          >
            Borrar
          </button>
        </div>

        {!wishlist && <Gallery restaurant={restaurant} onZoom={zoom} />}

        <section className="section">
          <h3 className="section-title">
            Qué comimos
            {restaurant.dishes.length > 0 && (
              <span className="section-count">{restaurant.dishes.length}</span>
            )}
          </h3>
          {restaurant.dishes.length === 0 && !adding && (
            <p className="empty-hint">Aún no han apuntado ningún plato aquí.</p>
          )}

          <ul className="dish-list">
            {restaurant.dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                restaurantId={restaurant.id}
                onZoom={zoom}
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
              className="button button--soft button--block"
              onClick={() => setAdding(true)}
            >
              + Añadir plato
            </button>
          )}
        </section>

        <QuoteSection key={restaurant.id} restaurant={restaurant} />
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
