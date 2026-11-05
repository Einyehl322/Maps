import { FOR_US } from '../lib/couple'
import { estimate, candidates } from './budget'
import { useMenuLookups } from './menuLookupsContext'
import { formatSoles } from './price'
import type { Restaurant } from './types'

/** Días que faltan para `yyyy-mm-dd` (0 = hoy), en hora local. */
function daysUntil(day: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(day)
  if (!match) return null
  const target = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
}

function whenLabel(day: string | undefined): string {
  if (!day) return 'Sin fecha todavía'
  const days = daysUntil(day)
  if (days === null) return day
  const date = new Date(`${day}T12:00:00`).toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  if (days === 0) return `¡Hoy! · ${date}`
  if (days === 1) return `Mañana · ${date}`
  if (days > 1) return `En ${days} días · ${date}`
  return `Era el ${date}`
}

/** ⭐ El apartado del próximo destino, arriba del todo. */
export function NextDestination({
  place,
  onOpen,
}: {
  place: Restaurant
  onOpen: () => void
}) {
  const { lookups } = useMenuLookups()
  const [candidate] = candidates([place])
  const value = estimate(candidate, lookups, 10)
  const cost = !value
    ? null
    : value.high === null || Math.round(value.low) === Math.round(value.high)
      ? formatSoles(value.low, true)
      : `${formatSoles(value.low, true)} – ${formatSoles(value.high, true)}`

  return (
    <button type="button" className="next-card" onClick={onOpen}>
      <span className="next-card-star" aria-hidden="true">
        ★
      </span>
      <span className="next-card-text">
        <span className="next-card-kicker">Próximo destino</span>
        <span className="next-card-name">{place.name}</span>
        <span className="next-card-when">{whenLabel(place.nextDate)}</span>
        {cost && (
          <span className="next-card-cost">
            {cost} {FOR_US}
          </span>
        )}
      </span>
    </button>
  )
}
