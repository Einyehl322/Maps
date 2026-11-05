/**
 * Fechas de calendario (`yyyy-mm-dd`) en hora local.
 *
 * `new Date().toISOString()` va en UTC: en Lima (UTC−5), a partir de las 19:00
 * ya daría el día siguiente. Y `new Date('2026-07-12')` se interpreta como
 * medianoche UTC, que en Lima es el día 11.
 */

/** Hoy en formato `yyyy-mm-dd`, que es lo que espera `<input type="date">`. */
export function today(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** "12 de julio de 2026" a partir de `yyyy-mm-dd`, sin desfase de zona horaria. */
export function formatDay(value?: string): string | null {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
