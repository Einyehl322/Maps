import { OSM_CATEGORIES } from './places'
import type { OsmStatus } from './useOsmPlaces'

/** Interruptor y leyenda de la capa de locales de OpenStreetMap. */
export function OsmControl({
  enabled,
  onToggle,
  status,
  count,
}: {
  enabled: boolean
  onToggle: (next: boolean) => void
  status: OsmStatus
  count: number
}) {
  const message = () => {
    switch (status) {
      case 'zoom':
        return 'Acércate para ver los locales'
      case 'loading':
        return 'Buscando locales…'
      case 'error':
        return 'OpenStreetMap no responde ahora mismo'
      case 'ready':
        return count === 1 ? '1 local a la vista' : `${count} locales a la vista`
      default:
        return ''
    }
  }

  return (
    <div className="osm-control">
      <button
        type="button"
        className={`osm-toggle${enabled ? ' is-active' : ''}`}
        aria-pressed={enabled}
        onClick={() => onToggle(!enabled)}
      >
        <span className="osm-switch" aria-hidden="true" />
        Locales de Lima
      </button>

      {enabled && (
        <>
          <p className={`osm-status${status === 'error' ? ' is-error' : ''}`}>
            {message()}
          </p>
          <ul className="osm-legend">
            {OSM_CATEGORIES.map((item) => (
              <li key={item.id}>
                <span className="osm-dot" style={{ background: item.color }} />
                {item.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
