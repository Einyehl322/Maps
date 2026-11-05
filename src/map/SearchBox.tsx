import { useEffect, useRef, useState } from 'react'
import { useMap } from './mapContext'
import { SEARCH_REQUEST } from './searchRequest'
import { useGeocoder, type GeoResult } from './useGeocoder'

export function SearchBox({ onSelect }: { onSelect: (result: GeoResult) => void }) {
  const { map } = useMap()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const { results, loading, error } = useGeocoder(query, map)

  useEffect(() => {
    setHighlighted(0)
  }, [results])

  // Búsquedas pedidas desde otras partes de la app ("más lugares norteños").
  useEffect(() => {
    const onRequest = (event: Event) => {
      const term = (event as CustomEvent<string>).detail
      if (typeof term !== 'string' || !term.trim()) return
      setQuery(term)
      setOpen(true)
      inputRef.current?.focus()
    }
    window.addEventListener(SEARCH_REQUEST, onRequest)
    return () => window.removeEventListener(SEARCH_REQUEST, onRequest)
  }, [])

  const select = (result: GeoResult) => {
    setQuery(result.name)
    setOpen(false)
    inputRef.current?.blur()

    if (result.bbox) {
      map.fitBounds(result.bbox, { padding: 96, maxZoom: 17, duration: 900 })
    } else {
      map.flyTo({ center: result.center, zoom: 17, duration: 900 })
    }
    onSelect(result)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
      return
    }
    if (!results.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setHighlighted((i) => (i + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setHighlighted((i) => (i - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const result = results[highlighted]
      if (result) select(result)
    }
  }

  const showPanel = open && query.trim().length >= 3

  return (
    <div className="search">
      <div className="search-field">
        <SearchIcon />
        <input
          ref={inputRef}
          type="search"
          className="search-input"
          placeholder="Buscar un lugar o dirección"
          value={query}
          autoComplete="off"
          spellCheck={false}
          aria-label="Buscar en el mapa"
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={() => {
              setQuery('')
              setOpen(false)
              inputRef.current?.focus()
            }}
            aria-label="Borrar búsqueda"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {showPanel && (
        <ul className="search-results" role="listbox">
          {loading && !results.length && <li className="search-empty">Buscando…</li>}
          {!loading && error && <li className="search-empty">{error}</li>}
          {!loading && !error && !results.length && (
            <li className="search-empty">Sin resultados</li>
          )}
          {results.map((result, index) => (
            <li key={result.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === highlighted}
                className={`search-result${index === highlighted ? ' is-active' : ''}`}
                onMouseEnter={() => setHighlighted(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(result)}
              >
                <PinIcon />
                <span className="search-result-text">
                  <span className="search-result-name">{result.name}</span>
                  {result.detail && (
                    <span className="search-result-detail">{result.detail}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg className="search-result-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5"
      />
    </svg>
  )
}
