import { useEffect, useState } from 'react'
import { useAccount } from '../auth/accountContext'
import { normalizeUrl } from '../osm/details'
import type { RestaurantDraft } from './draft'
import { FOOD_CATEGORIES, guessFoodCategory } from './food'
import { PRICE_LABELS, PRICE_LEVELS, priceMark } from './price'
import { useRestaurants } from './restaurantsContext'
import { newId, type Restaurant } from './types'

/** Lo que el geocoder averigua del punto; llega después de abrir el formulario. */
export type FormSuggestion = {
  name: string
  address: string
  loading: boolean
}

export function RestaurantForm({
  draft,
  suggestion,
  onCancel,
  onSaved,
}: {
  draft: RestaurantDraft
  suggestion?: FormSuggestion | null
  onCancel: () => void
  onSaved: (restaurant: Restaurant) => void
}) {
  const { upsertRestaurant } = useRestaurants()
  const account = useAccount()
  const [values, setValues] = useState(draft)
  const [saving, setSaving] = useState(false)

  // Rellena solo los campos que sigan vacíos: lo que escribas manda.
  const suggestedName = suggestion?.name ?? ''
  const suggestedAddress = suggestion?.address ?? ''
  useEffect(() => {
    if (!suggestedName && !suggestedAddress) return
    setValues((prev) => ({
      ...prev,
      name: prev.name || suggestedName,
      address: prev.address || suggestedAddress,
    }))
  }, [suggestedName, suggestedAddress])

  const set = <K extends keyof RestaurantDraft>(key: K, value: RestaurantDraft[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = values.name.trim()
    if (!name || saving) return

    setSaving(true)
    try {
      const saved = await upsertRestaurant({
        id: values.id ?? newId(),
        osmId: values.osmId,
        name,
        status: values.status,
        address: values.address.trim() || undefined,
        cuisine: values.cuisine.trim() || undefined,
        visitedAt: values.status === 'visited' ? values.visitedAt || undefined : undefined,
        notes: values.notes.trim() || undefined,
        priceLevel: values.priceLevel ?? undefined,
        website: normalizeUrl(values.website),
        foodCategory: values.foodCategory ?? undefined,
        ...messageFields(values.message, draft.message, account?.email),
        lng: values.lng,
        lat: values.lat,
      })
      onSaved(saved)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <header className="panel-header">
        <h2>{values.id ? 'Editar lugar' : 'Nuevo lugar'}</h2>
        <button type="button" className="icon-button" onClick={onCancel} aria-label="Cerrar">
          ✕
        </button>
      </header>

      <div className="panel-body">
        <label className="field">
          <span className="field-label">Nombre</span>
          <input
            className="input"
            value={values.name}
            onChange={(event) => set('name', event.target.value)}
            placeholder="Ej. La Mar, Parque Kennedy…"
            autoFocus
            required
          />
        </label>

        <div className="segmented" role="group" aria-label="Estado">
          <button
            type="button"
            className={values.status === 'visited' ? 'is-active' : ''}
            onClick={() => set('status', 'visited')}
          >
            Ya fuimos
          </button>
          <button
            type="button"
            className={values.status === 'wishlist' ? 'is-active' : ''}
            onClick={() => set('status', 'wishlist')}
          >
            Queremos ir
          </button>
        </div>

        {values.status === 'wishlist' && (
          <label className="field field--love">
            <span className="field-label">💌 Mensaje (opcional)</span>
            <textarea
              className="input textarea"
              rows={2}
              value={values.message}
              onChange={(event) => set('message', event.target.value)}
              placeholder="¿Vamos el sábado? Dicen que el ceviche es buenazo…"
              maxLength={500}
            />
          </label>
        )}

        <label className="field">
          <span className="field-label">Dirección</span>
          <input
            className="input"
            value={values.address}
            onChange={(event) => set('address', event.target.value)}
            placeholder="Calle, número, ciudad"
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Tipo de lugar</span>
            <input
              className="input"
              value={values.cuisine}
              onChange={(event) => set('cuisine', event.target.value)}
              placeholder="Cevichería, café, mirador…"
            />
          </label>

          {values.status === 'visited' && (
            <label className="field">
              <span className="field-label">Fecha de la visita</span>
              <input
                className="input"
                type="date"
                value={values.visitedAt}
                onChange={(event) => set('visitedAt', event.target.value)}
              />
            </label>
          )}
        </div>

        <div className="field">
          <span className="field-label">
            Categoría
            {!values.foodCategory && <span className="field-hint"> · sugerida</span>}
          </span>
          <div className="chips" role="group" aria-label="Categoría">
            {FOOD_CATEGORIES.map((info) => {
              const active =
                (values.foodCategory ?? guessFoodCategory(values.cuisine, values.name)) === info.id
              return (
                <button
                  key={info.id}
                  type="button"
                  className={`chip${active ? ' is-active' : ''}`}
                  onClick={() => set('foodCategory', info.id)}
                >
                  {info.emoji} {info.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="field">
          <span className="field-label">
            Precio por persona
            {values.priceLevel && (
              <span className="field-hint"> · {PRICE_LABELS[values.priceLevel]}</span>
            )}
          </span>
          <div className="segmented" role="group" aria-label="Precio por persona">
            <button
              type="button"
              className={values.priceLevel === null ? 'is-active' : ''}
              onClick={() => set('priceLevel', null)}
            >
              ?
            </button>
            {PRICE_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                className={values.priceLevel === level ? 'is-active' : ''}
                onClick={() => set('priceLevel', level)}
                title={PRICE_LABELS[level]}
              >
                {priceMark(level)}
              </button>
            ))}
          </div>
        </div>

        <label className="field">
          <span className="field-label">Link (web, Instagram o carta)</span>
          <input
            className="input"
            type="url"
            inputMode="url"
            value={values.website}
            onChange={(event) => set('website', event.target.value)}
            placeholder="instagram.com/turestaurante"
          />
        </label>

        <label className="field">
          <span className="field-label">Notas</span>
          <textarea
            className="input textarea"
            rows={3}
            value={values.notes}
            onChange={(event) => set('notes', event.target.value)}
            placeholder="Qué hicimos, qué nos gustó, para recordar…"
          />
        </label>

        <p className="coords">
          📍 {values.lat.toFixed(5)}, {values.lng.toFixed(5)}
          {suggestion?.loading && ' · buscando qué hay aquí…'}
        </p>
      </div>

      <footer className="panel-footer">
        <button type="button" className="button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="button button--primary" disabled={!values.name.trim() || saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </footer>
    </form>
  )
}

/** El autor solo cambia si cambia el mensaje: editar otra cosa no lo "firma". */
function messageFields(
  next: string,
  previous: string,
  email: string | undefined,
): { message?: string; messageFrom?: string } | Record<string, never> {
  const message = next.trim()
  if (message === previous.trim()) return {}
  return { message: message || undefined, messageFrom: message ? email : undefined }
}
