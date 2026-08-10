import { useEffect, useState } from 'react'
import type { RestaurantDraft } from './draft'
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
        <h2>{values.id ? 'Editar restaurante' : 'Nuevo restaurante'}</h2>
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
            placeholder="Ej. Casa Julio"
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
            Ya he ido
          </button>
          <button
            type="button"
            className={values.status === 'wishlist' ? 'is-active' : ''}
            onClick={() => set('status', 'wishlist')}
          >
            Quiero ir
          </button>
        </div>

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
            <span className="field-label">Tipo de cocina</span>
            <input
              className="input"
              value={values.cuisine}
              onChange={(event) => set('cuisine', event.target.value)}
              placeholder="Japonesa, tapas…"
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

        <label className="field">
          <span className="field-label">Notas</span>
          <textarea
            className="input textarea"
            rows={3}
            value={values.notes}
            onChange={(event) => set('notes', event.target.value)}
            placeholder="Reservar con antelación, pedir la mesa del fondo…"
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
