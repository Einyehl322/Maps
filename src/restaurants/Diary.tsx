import { useEffect, useMemo, useRef, useState } from 'react'
import { backfill, byNewest, factKey, type Activity, type ActivityKind } from './activity'
import { usePhotoUrl } from './photos'
import { formatSoles, PRICE_LABELS, priceMark, quoteTotals, spendingOf } from './price'
import { useRestaurants } from './restaurantsContext'
import { store } from './storage'
import type { Restaurant } from './types'

type Filter = 'all' | 'visits' | 'food' | 'photos' | 'money' | 'love'

const FILTERS: { id: Filter; label: string; kinds: ActivityKind[] }[] = [
  { id: 'all', label: 'Todo', kinds: [] },
  { id: 'visits', label: 'Salidas', kinds: ['place_added', 'visited', 'wishlist', 'place_removed'] },
  { id: 'food', label: 'Platos', kinds: ['dish_added'] },
  { id: 'photos', label: 'Fotos', kinds: ['photos_added'] },
  { id: 'money', label: 'Precios', kinds: ['price_level', 'quote_saved'] },
  { id: 'love', label: 'Mensajes', kinds: ['message'] },
]

/**
 * Entradas para lo que ya existía antes que el diario: todo lo creado antes de
 * la primera entrada "de verdad". Lo posterior ya tiene la suya.
 */
function missingHistory(places: Restaurant[], entries: Activity[]): Activity[] {
  const real = entries.filter((item) => !item.id.startsWith('pasado-'))
  const since = real.length ? Math.min(...real.map((item) => Date.parse(item.at))) : null
  const knownIds = new Set(entries.map((item) => item.id))
  // Si ya hay una entrada real del mismo hecho (p. ej. "fueron a X"), no se repite.
  const knownFacts = new Set(real.map(factKey))
  return backfill(places).filter(
    (item) =>
      !knownIds.has(item.id) &&
      !knownFacts.has(factKey(item)) &&
      (since === null || Date.parse(item.at) < since),
  )
}

export function Diary({
  onClose,
  onSelect,
}: {
  onClose: () => void
  onSelect: (place: Restaurant) => void
}) {
  const { restaurants, ready } = useRestaurants()
  const [entries, setEntries] = useState<Activity[] | null>(null)
  const [names, setNames] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<Filter>('all')
  const [failed, setFailed] = useState(false)

  // Se carga una vez al abrir; la lista de lugares se lee de aquí.
  const placesRef = useRef(restaurants)
  placesRef.current = restaurants

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    void (async () => {
      try {
        const [list, members] = await Promise.all([store.loadActivity(), store.memberNames()])
        const history = missingHistory(placesRef.current, list)
        if (history.length) await store.saveActivity(history)
        if (cancelled) return
        setNames(members)
        setEntries([...list, ...history].sort(byNewest))
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [ready])

  const visible = useMemo(() => {
    const kinds = FILTERS.find((item) => item.id === filter)?.kinds ?? []
    return (entries ?? []).filter((item) => !kinds.length || kinds.includes(item.kind))
  }, [entries, filter])

  const months = useMemo(() => groupByMonth(visible), [visible])
  const byId = useMemo(() => new Map(restaurants.map((item) => [item.id, item])), [restaurants])

  const visited = restaurants.filter((item) => item.status === 'visited').length
  const dishes = restaurants.flatMap((item) => item.dishes)
  const spent = spendingOf(dishes).total
  const photos = restaurants.reduce((sum, item) => sum + (item.photoIds?.length ?? 0), 0)
  const planned = restaurants.reduce((sum, item) => {
    const quote = item.quote
    if (!quote?.items.length) return sum
    return sum + quoteTotals(quote.items, quote.people, quote.tipPercent).total
  }, 0)
  const first = entries?.length ? entries[entries.length - 1].at : null

  return (
    <div className="diary">
      <header className="diary-head">
        <div>
          <span className="diary-kicker">Solo para nosotros</span>
          <h2>Nuestro diario</h2>
          {first && <p>Desde el {formatDate(first)}</p>}
        </div>
        <button type="button" className="hero-close" onClick={onClose} aria-label="Cerrar diario">
          ✕
        </button>
      </header>

      <div className="diary-body">
        <div className="diary-stats">
          <Stat value={String(visited)} label={visited === 1 ? 'lugar juntos' : 'lugares juntos'} />
          <Stat value={String(dishes.length)} label={dishes.length === 1 ? 'plato' : 'platos'} />
          <Stat value={formatSoles(spent, true)} label="en comida" />
          <Stat value={String(photos)} label={photos === 1 ? 'foto' : 'fotos'} />
          {planned > 0 && <Stat value={formatSoles(planned, true)} label="cotizado" />}
        </div>

        <div className="chips" role="tablist" aria-label="Filtrar el diario">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={`chip${filter === item.id ? ' is-active' : ''}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {failed && <p className="empty-hint">No se pudo cargar el diario. Revisa tu conexión.</p>}
        {!failed && entries === null && <p className="empty-hint">Abriendo el diario…</p>}
        {entries !== null && visible.length === 0 && (
          <p className="empty-hint">
            {entries.length === 0
              ? 'Aún no hay nada. Cada lugar, plato, foto, precio y cotización que guarden aparecerá aquí.'
              : 'Nada de esto todavía.'}
          </p>
        )}

        {months.map(([month, items]) => (
          <section key={month} className="diary-month">
            <h3>{month}</h3>
            <ol className="timeline">
              {items.map((item) => {
                const place = item.placeId ? byId.get(item.placeId) : undefined
                return (
                  <li key={item.id}>
                    <DiaryEntry
                      entry={item}
                      who={who(item.actor, names)}
                      onOpen={place ? () => onSelect(place) : undefined}
                    />
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat">
      <strong className="stat-value">{value}</strong>
      <span className="stat-label">{label}</span>
    </div>
  )
}

const ICONS: Record<ActivityKind, string> = {
  place_added: '📍',
  visited: '♥',
  wishlist: '🔖',
  message: '💌',
  price_level: '💰',
  dish_added: '🍽',
  photos_added: '📷',
  quote_saved: '🧾',
  place_removed: '🗑',
}

function DiaryEntry({
  entry,
  who,
  onOpen,
}: {
  entry: Activity
  who: string | null
  onOpen?: () => void
}) {
  const place = <strong>{entry.placeName}</strong>
  let text: React.ReactNode
  let extra: React.ReactNode = null

  switch (entry.kind) {
    case 'place_added':
      text =
        entry.detail.status === 'wishlist' ? (
          <>Guardaron {place} para ir</>
        ) : (
          <>Añadieron {place} a su mapa</>
        )
      break
    case 'visited':
      text = <>Fueron a {place}</>
      break
    case 'wishlist':
      text = <>Quieren ir a {place}</>
      break
    case 'message':
      text = <>Mensaje sobre {place}</>
      extra = <blockquote className="timeline-quote">{entry.detail.message}</blockquote>
      break
    case 'price_level':
      text = (
        <>
          {place}: {priceMark(entry.detail.level)}{' '}
          <span className="timeline-muted">({PRICE_LABELS[entry.detail.level]} p.p.)</span>
        </>
      )
      break
    case 'dish_added':
      text = (
        <>
          Probaron <strong>{entry.detail.name}</strong> en {place}
        </>
      )
      extra = (
        <span className="timeline-tags">
          <span className="timeline-stars">{'★'.repeat(entry.detail.rating)}</span>
          {entry.detail.price != null && <span>{formatSoles(entry.detail.price)}</span>}
        </span>
      )
      break
    case 'photos_added': {
      const count = entry.detail.photoIds.length
      text = (
        <>
          {count === 1 ? 'Subieron una foto' : `Subieron ${count} fotos`} de {place}
        </>
      )
      extra = (
        <span className="timeline-photos">
          {entry.detail.photoIds.slice(0, 4).map((id) => (
            <Thumb key={id} photoId={id} />
          ))}
        </span>
      )
      break
    }
    case 'quote_saved':
      text = <>Cotizaron una salida a {place}</>
      extra = (
        <span className="timeline-tags">
          <span>{formatSoles(entry.detail.total)}</span>
          <span>
            {entry.detail.people} {entry.detail.people === 1 ? 'persona' : 'personas'} ·{' '}
            {formatSoles(entry.detail.perPerson)} c/u
          </span>
        </span>
      )
      break
    case 'place_removed':
      text = <>Borraron {place}</>
      break
  }

  const body = (
    <>
      <span className={`timeline-dot timeline-dot--${entry.kind}`} aria-hidden="true">
        {ICONS[entry.kind]}
      </span>
      <span className="timeline-content">
        <span className="timeline-text">{text}</span>
        {extra}
        <span className="timeline-meta">
          {formatWhen(entry)}
          {who && ` · ${who}`}
        </span>
      </span>
    </>
  )

  return onOpen ? (
    <button type="button" className="timeline-item" onClick={onOpen}>
      {body}
    </button>
  ) : (
    <div className="timeline-item">{body}</div>
  )
}

/** Miniatura que desaparece si la foto ya no existe. */
function Thumb({ photoId }: { photoId: string }) {
  const url = usePhotoUrl(photoId)
  if (!url) return null
  return <img src={url} alt="" loading="lazy" />
}

function who(actor: string | undefined, names: Record<string, string>): string | null {
  if (!actor) return null
  return names[actor.toLowerCase()] ?? actor.split('@')[0]
}

function groupByMonth(items: Activity[]): [string, Activity[]][] {
  const groups = new Map<string, Activity[]>()
  for (const item of items) {
    const date = new Date(item.at)
    const label = Number.isNaN(date.getTime())
      ? 'Sin fecha'
      : date.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })
    const key = label.charAt(0).toUpperCase() + label.slice(1)
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  return [...groups]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Las visitas reconstruidas no tienen hora: solo el día. */
function formatWhen(entry: Activity): string {
  const date = new Date(entry.at)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
  if (entry.id.startsWith('pasado-visita-')) return day
  const time = date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time}`
}
