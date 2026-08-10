import { BASEMAP_LIST } from './basemaps'
import { useMap } from './mapContext'

export function BasemapSwitcher() {
  const { basemap, setBasemap } = useMap()

  return (
    <div className="basemaps" role="group" aria-label="Tipo de mapa">
      {BASEMAP_LIST.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`basemap${option.id === basemap ? ' is-active' : ''}`}
          aria-pressed={option.id === basemap}
          onClick={() => setBasemap(option.id)}
        >
          <span className="basemap-swatch" style={{ background: option.swatch }} />
          <span className="basemap-label">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
