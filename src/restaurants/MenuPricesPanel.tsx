import { useState } from 'react'
import { useMenuLookups } from './menuLookupsContext'
import { formatSoles, MENU_CATEGORIES, menuKey, type MenuItem, type MenuTarget } from './price'

const CATEGORY_LABELS: Record<MenuItem['category'], string> = {
  entrada: 'Entradas',
  fondo: 'Fondos',
  postre: 'Postres',
  bebida: 'Bebidas',
  otro: 'Otros',
}

/**
 * Precios de la carta buscados en internet, para armar la cotización cosa por
 * cosa. La búsqueda corre en Supabase (función `price-search`) y cuesta unos
 * centavos de dólar; el resultado se guarda 30 días.
 */
const CONFIDENCE_LABELS = {
  alta: 'Confianza alta: carta oficial reciente',
  media: 'Confianza media: app de delivery o fuente no oficial',
  baja: 'Confianza baja: fuentes antiguas o dudosas',
}

export function MenuPricesPanel({
  target,
  fallbackKey,
  placeName,
  counts,
  onAdd,
}: {
  target: MenuTarget
  /** Si no hay búsqueda propia, usar esta (p. ej. la del lugar de la guía). */
  fallbackKey?: string
  placeName: string
  /** Cuántas veces está ya cada producto en la cotización, por nombre. */
  counts: Record<string, number>
  onAdd: (item: MenuItem) => void
}) {
  const { enabled, lookups, ready, search: runSearch } = useMenuLookups()
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const data = lookups[menuKey(target)] ?? (fallbackKey ? lookups[fallbackKey] : undefined) ?? null
  const loading = !ready

  const search = async (force: boolean) => {
    setSearching(true)
    setError(null)
    try {
      await runSearch(target, force)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo buscar.')
    } finally {
      setSearching(false)
    }
  }

  if (!enabled) {
    return (
      <div className="menu-prices menu-prices--off">
        <strong>🔎 Precios de la carta</strong>
        <span>Se activa cuando conecten Supabase y la clave de la API de Claude.</span>
      </div>
    )
  }

  if (loading) return <div className="menu-prices menu-prices--loading">Cargando precios…</div>

  if (searching) {
    return (
      <div className="menu-prices menu-prices--searching" role="status">
        <span className="menu-spinner" aria-hidden="true" />
        <span>
          Buscando la carta de <strong>{placeName}</strong> en internet… suele tardar un minuto.
        </span>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="menu-prices">
        <button type="button" className="button button--soft button--block" onClick={() => void search(false)}>
          🔎 Buscar precios de la carta
        </button>
        <span className="menu-hint">
          Busca en su web, Instagram y apps de delivery. Cada búsqueda cuesta ≈ US$0.30 y se guarda 30 días.
        </span>
        {error && <p className="menu-error">{error}</p>}
      </div>
    )
  }

  const searchedOn = new Date(data.searched_at).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
  })
  const groups = MENU_CATEGORIES.map((category) => ({
    category,
    items: data.items.filter((item) => item.category === category),
  })).filter((group) => group.items.length)

  return (
    <div className="menu-prices">
      <div className="menu-head">
        <strong>🔎 Precios de la carta</strong>
        <button
          type="button"
          className="link-button"
          onClick={() => {
            if (confirm('¿Buscar de nuevo? Es una búsqueda nueva (≈ US$0.30).')) void search(true)
          }}
        >
          Buscar de nuevo
        </button>
      </div>

      {data.found ? (
        <>
          <p className={`menu-confidence menu-confidence--${data.confidence}`}>
            {CONFIDENCE_LABELS[data.confidence]}
          </p>
          <p className="menu-summary">
            {data.summary}
            <span>
              {' '}
              · buscado el {searchedOn}
              {data.source_date && ` · carta de ${data.source_date}`}. Los precios pueden haber
              cambiado.
            </span>
          </p>
          {groups.map((group) => (
            <section key={group.category} className="menu-group">
              <h4>{CATEGORY_LABELS[group.category]}</h4>
              <ul>
                {group.items.map((item) => {
                  const added = counts[item.name] ?? 0
                  return (
                    <li key={`${item.name}-${item.price}`} className="menu-item">
                      <span className="menu-item-text">
                        <span className="menu-item-name">{item.name}</span>
                        <span className="menu-item-meta">
                          {item.note && `${item.note} · `}
                          <a href={item.source_url} target="_blank" rel="noreferrer">
                            fuente
                          </a>
                        </span>
                      </span>
                      <span className="menu-item-price">{formatSoles(item.price)}</span>
                      <button
                        type="button"
                        className={`menu-add${added ? ' is-added' : ''}`}
                        onClick={() => onAdd(item)}
                        aria-label={`Añadir ${item.name} a la cotización`}
                      >
                        {added ? `×${added}` : '+'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </>
      ) : (
        <p className="menu-summary">
          No encontramos precios publicados de este lugar.
          {data.summary && <span> {data.summary}</span>}
        </p>
      )}
      {error && <p className="menu-error">{error}</p>}
    </div>
  )
}
