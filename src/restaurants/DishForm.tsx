import { useEffect, useRef, useState } from 'react'
import { removePhotos, storePhoto, usePhotoUrl } from './photos'
import { StarInput } from './Rating'
import { useRestaurants } from './restaurantsContext'
import { newId, type Dish } from './types'

export function DishForm({
  restaurantId,
  dish,
  onDone,
}: {
  restaurantId: string
  dish?: Dish
  onDone: () => void
}) {
  const { upsertDish } = useRestaurants()
  const [name, setName] = useState(dish?.name ?? '')
  const [rating, setRating] = useState(dish?.rating ?? 5)
  const [price, setPrice] = useState(dish?.price != null ? String(dish.price) : '')
  const [notes, setNotes] = useState(dish?.notes ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [photoRemoved, setPhotoRemoved] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const savedPhotoUrl = usePhotoUrl(dish?.photoId)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const photoUrl = previewUrl ?? (photoRemoved ? null : savedPhotoUrl)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || saving) return

    setSaving(true)
    try {
      let photoId = photoRemoved ? undefined : dish?.photoId
      if (file) photoId = await storePhoto(file)
      const parsedPrice = Number.parseFloat(price.replace(',', '.'))
      const next: Dish = {
        id: dish?.id ?? newId(),
        name: trimmed,
        rating,
        notes: notes.trim() || undefined,
        price: Number.isFinite(parsedPrice) ? parsedPrice : undefined,
        photoId,
        createdAt: dish?.createdAt ?? new Date().toISOString(),
      }
      await upsertDish(restaurantId, next)
      // La foto anterior ya no la referencia nadie.
      if (dish?.photoId && dish.photoId !== photoId) await removePhotos([dish.photoId])
      onDone()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="dish-form" onSubmit={submit}>
      <label className="field">
        <span className="field-label">Plato</span>
        <input
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ej. Lomo saltado"
          autoFocus
          required
        />
      </label>

      <div className="field-row">
        <div className="field">
          <span className="field-label">Puntuación</span>
          <StarInput value={rating} onChange={setRating} />
        </div>
        <label className="field field--narrow">
          <span className="field-label">Precio (S/)</span>
          <input
            className="input"
            inputMode="decimal"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="35.00"
          />
        </label>
      </div>

      <label className="field">
        <span className="field-label">Notas</span>
        <input
          className="input"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Qué tal estaba"
        />
      </label>

      <div className="field">
        <span className="field-label">Foto</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null)
            setPhotoRemoved(false)
          }}
        />
        {photoUrl ? (
          <div className="photo-picker">
            <img src={photoUrl} alt="" className="photo-preview" />
            <div className="photo-actions">
              <button type="button" className="button" onClick={() => fileRef.current?.click()}>
                Cambiar
              </button>
              <button
                type="button"
                className="button"
                onClick={() => {
                  setFile(null)
                  setPhotoRemoved(true)
                  if (fileRef.current) fileRef.current.value = ''
                }}
              >
                Quitar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="photo-drop"
            onClick={() => fileRef.current?.click()}
          >
            📷 Añadir foto del plato
          </button>
        )}
      </div>

      <div className="panel-footer panel-footer--inline">
        <button type="button" className="button" onClick={onDone}>
          Cancelar
        </button>
        <button
          type="submit"
          className="button button--primary"
          disabled={!name.trim() || saving}
        >
          {saving ? 'Guardando…' : dish ? 'Guardar plato' : 'Añadir plato'}
        </button>
      </div>
    </form>
  )
}
