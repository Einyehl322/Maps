import { useState } from 'react'
import {
  estimateForPeople,
  formatSoles,
  parseAmount,
  quoteTotals,
  TIP_OPTIONS,
  type Quote,
} from './price'
import { FOR_US, PEOPLE } from '../lib/couple'
import { linkedRec } from './food'
import { MenuPricesPanel } from './MenuPricesPanel'
import { useRestaurants } from './restaurantsContext'
import { newId, type Restaurant } from './types'

/** Fila en edición: el precio va como texto para no pelear con el teclado. */
type Row = { id: string; name: string; price: string; qty: number }

function rowsFrom(quote: Quote | undefined): Row[] {
  return (quote?.items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    price: String(item.price),
    qty: item.qty,
  }))
}

function validItems(rows: Row[]) {
  return rows.flatMap((row) => {
    const price = parseAmount(row.price)
    const name = row.name.trim()
    if (!name || price === null || row.qty < 1) return []
    return [{ id: row.id, name, price, qty: row.qty }]
  })
}

export function QuoteSection({ restaurant }: { restaurant: Restaurant }) {
  const { upsertRestaurant } = useRestaurants()
  const quote = restaurant.quote
  const [editing, setEditing] = useState(false)
  const [rows, setRows] = useState<Row[]>(() => rowsFrom(quote))
  const [tipPercent, setTipPercent] = useState(quote?.tipPercent ?? 10)
  const [saving, setSaving] = useState(false)

  const open = () => {
    setRows(rowsFrom(quote))
    setTipPercent(quote?.tipPercent ?? 10)
    setEditing(true)
  }

  const save = async (next: Quote | undefined) => {
    setSaving(true)
    try {
      await upsertRestaurant({ ...restaurant, quote: next })
      setEditing(false)
    } catch {
      // El aviso de error ya aparece en el panel.
    } finally {
      setSaving(false)
    }
  }

  // Platos ya probados con precio: se añaden con un toque.
  const known = restaurant.dishes.filter((dish) => dish.price != null)

  if (!editing) {
    const saved = quote && quote.items.length > 0
    const totals = saved ? quoteTotals(quote.items, PEOPLE, quote.tipPercent) : null

    return (
      <section className="section">
        <h3 className="section-title">Cotizar salida</h3>
        {totals && quote ? (
          <button type="button" className="quote-summary" onClick={open}>
            <span className="quote-summary-total">{formatSoles(totals.total)}</span>
            <span className="quote-summary-sub">
              {FOR_US} · {formatSoles(totals.perPerson)} c/u
              {quote.tipPercent > 0 && ` · propina ${quote.tipPercent}%`}
            </span>
            <span className="quote-summary-edit">Editar</span>
          </button>
        ) : (
          <>
            {restaurant.priceLevel && (
              <p className="quote-estimate">
                Por su rango de precio, {FOR_US}:{' '}
                <strong>{estimateForPeople(restaurant.priceLevel, PEOPLE)}</strong>{' '}
                <span>(sin bebidas)</span>
              </p>
            )}
            <button type="button" className="button button--block" onClick={open}>
              🧾 Armar cotización
            </button>
          </>
        )}
      </section>
    )
  }

  const items = validItems(rows)
  const totals = quoteTotals(items, PEOPLE, tipPercent)
  /** Añade un producto (o suma uno si ya está) a la cotización. */
  const addItem = (name: string, price: number) =>
    setRows((prev) => {
      const existing = prev.find((row) => row.name === name)
      if (existing) {
        return prev.map((row) => (row === existing ? { ...row, qty: row.qty + 1 } : row))
      }
      return [...prev, { id: newId(), name, price: String(price), qty: 1 }]
    })
  const counts = Object.fromEntries(rows.map((row) => [row.name, row.qty]))

  const update = (id: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)))

  return (
    <section className="section quote">
      <h3 className="section-title">Cotizar salida</h3>

      <div className="quote-settings">
        <div className="quote-setting">
          <span>Para</span>
          <strong className="quote-for">{FOR_US}</strong>
        </div>
        <div className="quote-setting">
          <span>Propina</span>
          <div className="chips" role="group" aria-label="Propina">
            {TIP_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`chip${tipPercent === option ? ' is-active' : ''}`}
                onClick={() => setTipPercent(option)}
              >
                {option === 0 ? 'Sin' : `${option}%`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <MenuPricesPanel
        target={{ placeId: restaurant.id }}
        fallbackKey={linkedRec(restaurant) ? `rec:${linkedRec(restaurant)!.id}` : undefined}
        placeName={restaurant.name}
        counts={counts}
        onAdd={(item) => addItem(item.name, item.price)}
      />

      {known.length > 0 && (
        <div className="chips chips--wrap">
          {known.map((dish) => (
            <button
              key={dish.id}
              type="button"
              className="chip chip--add"
              onClick={() => addItem(dish.name, dish.price!)}
            >
              + {dish.name} · {formatSoles(dish.price!)}
            </button>
          ))}
        </div>
      )}

      <ul className="quote-rows">
        {rows.map((row) => (
          <li key={row.id} className="quote-row">
            <input
              className="input"
              value={row.name}
              onChange={(event) => update(row.id, { name: event.target.value })}
              placeholder="Plato o bebida"
              aria-label="Plato o bebida"
            />
            <input
              className="input quote-price"
              inputMode="decimal"
              value={row.price}
              onChange={(event) => update(row.id, { price: event.target.value })}
              placeholder="S/"
              aria-label="Precio unitario"
            />
            <input
              className="input quote-qty"
              type="number"
              min={1}
              value={row.qty}
              onChange={(event) =>
                update(row.id, { qty: Math.max(1, Number(event.target.value) || 1) })
              }
              aria-label="Cantidad"
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => setRows((prev) => prev.filter((item) => item.id !== row.id))}
              aria-label={`Quitar ${row.name || 'fila'}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="link-button"
        onClick={() =>
          setRows((prev) => [...prev, { id: newId(), name: '', price: '', qty: 1 }])
        }
      >
        + Añadir plato o bebida
      </button>

      <dl className="quote-totals">
        <dt>Subtotal</dt>
        <dd>{formatSoles(totals.subtotal)}</dd>
        {tipPercent > 0 && (
          <>
            <dt>Propina {tipPercent}%</dt>
            <dd>{formatSoles(totals.tip)}</dd>
          </>
        )}
        <dt className="quote-total-label">Total</dt>
        <dd className="quote-total">{formatSoles(totals.total)}</dd>
        <dt>Por persona</dt>
        <dd>{formatSoles(totals.perPerson)}</dd>
      </dl>

      <div className="panel-footer panel-footer--inline">
        {quote && (
          <button
            type="button"
            className="button button--danger"
            disabled={saving}
            onClick={() => void save(undefined)}
          >
            Borrar
          </button>
        )}
        <span className="spacer" />
        <button type="button" className="button" onClick={() => setEditing(false)}>
          Cancelar
        </button>
        <button
          type="button"
          className="button button--primary"
          disabled={saving || items.length === 0}
          onClick={() =>
            void save({ people: PEOPLE, tipPercent, items, updatedAt: new Date().toISOString() })
          }
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </section>
  )
}
