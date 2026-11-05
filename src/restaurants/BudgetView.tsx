import { useMemo, useState } from 'react'
import {
  candidates as buildCandidates,
  estimate,
  menuFor,
  verdict,
  type Basis,
  type Candidate,
  type Estimate,
  type Verdict,
} from './budget'
import { FOR_US } from '../lib/couple'
import { requestSearch } from '../map/searchRequest'
import { foodCategoryInfo, FOOD_CATEGORIES, type FoodCategory } from './food'
import type { Recommendation } from './lima'
import { useMenuLookups } from './menuLookupsContext'
import { formatSoles, TIP_OPTIONS } from './price'
import { useRestaurants } from './restaurantsContext'
import type { Restaurant } from './types'

const PREFS_KEY = 'maps:budget'
const COST_PER_SEARCH = 0.3

type Prefs = { budget: number; tip: number }

function loadPrefs(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) ?? 'null') as Partial<Prefs> | null
    return {
      budget: typeof raw?.budget === 'number' ? raw.budget : 150,
      tip: typeof raw?.tip === 'number' ? raw.tip : 10,
    }
  } catch {
    return { budget: 150, tip: 10 }
  }
}

const GROUPS: { id: Verdict; title: string; hint: string }[] = [
  { id: 'fits', title: '✅ Les alcanza', hint: 'Incluso pidiendo lo típico' },
  { id: 'tight', title: '🤏 Justo', hint: 'Alcanza eligiendo lo más económico' },
  { id: 'over', title: '❌ Se pasa', hint: 'Aun con lo más barato' },
  { id: 'unknown', title: '❔ Sin precio todavía', hint: 'Pongan un rango o busquen su carta' },
]

const BASIS_LABELS: Record<Basis, string> = {
  cotizacion: 'su cotización',
  carta: 'carta real',
  gastado: 'lo que gastaron',
  rango: 'rango aprox.',
}

export function BudgetView({
  onSelectPlace,
  onSelectRec,
}: {
  onSelectPlace: (place: Restaurant) => void
  onSelectRec: (rec: Recommendation) => void
}) {
  const { restaurants } = useRestaurants()
  const { enabled, lookups, bulk, startBulk, stopBulk, clearBulk } = useMenuLookups()
  const [prefs, setPrefs] = useState(loadPrefs)
  const [budgetText, setBudgetText] = useState(String(prefs.budget))
  const [food, setFood] = useState<FoodCategory | 'all'>('all')

  const update = (patch: Partial<Prefs>) =>
    setPrefs((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next))
      } catch {
        // Sin localStorage, el ajuste dura hasta recargar.
      }
      return next
    })

  const all = useMemo(() => buildCandidates(restaurants), [restaurants])

  const rows = useMemo(
    () =>
      all
        .filter((candidate) => food === 'all' || candidate.category === food)
        .map((candidate) => {
          const value = estimate(candidate, lookups, prefs.tip)
          return { candidate, value, verdict: verdict(value, prefs.budget) }
        })
        .sort((a, b) => (a.value?.low ?? Infinity) - (b.value?.low ?? Infinity)),
    [all, food, lookups, prefs],
  )

  // Todas las categorías, aunque no tengan lugares (p. ej. arequipeño): desde
  // ahí se pueden buscar en el mapa. "Otros" solo si hay alguno.
  const presentCategories = FOOD_CATEGORIES.filter(
    (info) => info.id !== 'otro' || all.some((candidate) => candidate.category === 'otro'),
  )

  // Lugares cuya carta aún no se buscó (la búsqueda masiva salta los demás).
  const pending = all.filter((candidate) => !menuFor(candidate, lookups))
  const runBulk = () => {
    const cost = (pending.length * COST_PER_SEARCH).toFixed(2)
    const ok = confirm(
      `Buscar la carta real de ${pending.length} lugares en internet.\n\n` +
        `Costo aproximado: US$${cost} (≈ US$${COST_PER_SEARCH} cada uno), ` +
        `y tarda unos ${Math.ceil(pending.length / 3)} minutos. Dejen esta pestaña abierta.\n\n¿Seguimos?`,
    )
    if (!ok) return
    startBulk(
      pending.map((candidate) => ({
        name: candidate.name,
        target: candidate.place
          ? { placeId: candidate.place.id }
          : {
              rec: {
                id: candidate.rec!.id,
                name: candidate.rec!.name,
                address: candidate.rec!.address,
                district: candidate.rec!.district,
                cuisine: foodCategoryInfo(candidate.category).label,
              },
            },
      })),
    )
  }

  return (
    <div className="budget">
      <div className="budget-controls">
        <label className="budget-amount">
          <span>¿Cuánto tienen? ({FOR_US})</span>
          <span className="budget-input">
            S/
            <input
              inputMode="decimal"
              value={budgetText}
              onChange={(event) => {
                setBudgetText(event.target.value)
                const value = Number.parseFloat(event.target.value.replace(',', '.'))
                if (Number.isFinite(value) && value >= 0) update({ budget: value })
              }}
              aria-label="Presupuesto total en soles"
            />
          </span>
        </label>
        <div className="quote-settings">
          <div className="quote-setting">
            <span>Propina</span>
            <div className="chips" role="group" aria-label="Propina">
              {TIP_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`chip${prefs.tip === option ? ' is-active' : ''}`}
                  onClick={() => update({ tip: option })}
                >
                  {option === 0 ? 'Sin' : `${option}%`}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="budget-note">
          Cada uno: un fondo y una bebida. Si ya cotizaron ese lugar, se usa su cotización.
        </p>
      </div>

      <div className="chips budget-chips" role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          className={`chip${food === 'all' ? ' is-active' : ''}`}
          onClick={() => setFood('all')}
        >
          Todas
        </button>
        {presentCategories.map((info) => (
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

      {food !== 'all' && food !== 'otro' && (
        <button
          type="button"
          className="link-button budget-more"
          onClick={() => requestSearch(foodCategoryInfo(food).searchTerm)}
        >
          🔍 Buscar más en el mapa: {foodCategoryInfo(food).emoji} {foodCategoryInfo(food).label}
        </button>
      )}

      <BulkCard
        enabled={enabled}
        pending={pending.length}
        bulk={bulk}
        onStart={runBulk}
        onStop={stopBulk}
        onClear={clearBulk}
      />

      {GROUPS.map((group) => {
        const items = rows.filter((row) => row.verdict === group.id)
        if (!items.length) return null
        return (
          <section key={group.id} className={`budget-group budget-group--${group.id}`}>
            <h3>
              {group.title} <span className="section-count">{items.length}</span>
            </h3>
            <p className="budget-hint">{group.hint}</p>
            <ul>
              {items.map(({ candidate, value }) => (
                <li key={candidate.key}>
                  <BudgetRow
                    candidate={candidate}
                    value={value}
                    onOpen={() =>
                      candidate.place ? onSelectPlace(candidate.place) : onSelectRec(candidate.rec!)
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function BudgetRow({
  candidate,
  value,
  onOpen,
}: {
  candidate: Candidate
  value: Estimate | null
  onOpen: () => void
}) {
  const info = foodCategoryInfo(candidate.category)
  const amount = !value
    ? '—'
    : value.high === null
      ? `desde ${formatSoles(value.low, true)}`
      : Math.round(value.low) === Math.round(value.high)
        ? formatSoles(value.low, true)
        : `${formatSoles(value.low, true)} – ${formatSoles(value.high, true)}`

  return (
    <button type="button" className="budget-row" onClick={onOpen}>
      <span className="budget-emoji" aria-hidden="true">
        {info.emoji}
      </span>
      <span className="budget-text">
        <span className="budget-name">
          {candidate.place?.isNext && '⭐ '}
          {candidate.name}
        </span>
        <span className="budget-sub">
          {[candidate.district, candidate.place ? 'nuestro' : 'guía'].filter(Boolean).join(' · ')}
        </span>
      </span>
      <span className="budget-amount-col">
        <strong>{amount}</strong>
        {value && (
          <span className={`budget-basis budget-basis--${value.basis}`}>
            {BASIS_LABELS[value.basis]}
            {value.confidence && value.confidence !== 'alta' && ` · confianza ${value.confidence}`}
          </span>
        )}
      </span>
    </button>
  )
}

function BulkCard({
  enabled,
  pending,
  bulk,
  onStart,
  onStop,
  onClear,
}: {
  enabled: boolean
  pending: number
  bulk: ReturnType<typeof useMenuLookups>['bulk']
  onStart: () => void
  onStop: () => void
  onClear: () => void
}) {
  if (!enabled) {
    return (
      <p className="budget-bulk budget-bulk--off">
        Ahora son <strong>rangos aproximados</strong>. Con Supabase y la clave de Claude
        conectados, aquí podrán traer la carta real de cada lugar con un botón.
      </p>
    )
  }

  if (bulk) {
    const finished = bulk.done >= bulk.total || bulk.current.length === 0
    const percent = Math.round((bulk.done / bulk.total) * 100)
    return (
      <div className="budget-bulk" role="status">
        <div className="budget-progress" aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </div>
        <span>
          {finished ? 'Listo' : 'Buscando cartas'}: {bulk.done} de {bulk.total}
          {bulk.failed > 0 && ` · ${bulk.failed} sin éxito`}
        </span>
        {!finished && bulk.current.length > 0 && (
          <span className="budget-hint">Ahora: {bulk.current.join(', ')}</span>
        )}
        <button type="button" className="link-button" onClick={finished ? onClear : onStop}>
          {finished ? 'Cerrar' : 'Parar'}
        </button>
      </div>
    )
  }

  if (!pending) {
    return <p className="budget-bulk budget-bulk--done">Todas las cartas están buscadas ✓</p>
  }

  return (
    <div className="budget-bulk">
      <button type="button" className="button button--soft button--block" onClick={onStart}>
        🔎 Cotizar con la carta real ({pending} lugares)
      </button>
      <span className="budget-hint">
        ≈ US${(pending * COST_PER_SEARCH).toFixed(2)} en total. Cada carta se guarda 30 días.
      </span>
    </div>
  )
}
