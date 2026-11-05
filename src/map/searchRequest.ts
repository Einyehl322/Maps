/**
 * Pedirle al buscador que busque algo desde otra parte de la app
 * (p. ej. "más lugares norteños"). El buscador escucha este evento.
 */
export const SEARCH_REQUEST = 'maps:search-request'

export function requestSearch(term: string) {
  window.dispatchEvent(new CustomEvent<string>(SEARCH_REQUEST, { detail: term }))
}
