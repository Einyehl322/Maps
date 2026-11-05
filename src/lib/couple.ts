/**
 * La app es para dos: tú y tu pareja. Todas las cuentas son para 2 personas.
 *
 * El nombre de tu pareja va en `VITE_PARTNER_NAME` (en `.env.local` y en las
 * variables de Vercel), no en el código: el repositorio es público.
 */
export const PEOPLE = 2

// `?.`: fuera de Vite (p. ej. en las pruebas con Node) no existe import.meta.env.
const partner = (import.meta.env?.VITE_PARTNER_NAME ?? '').trim()

export const PARTNER_NAME: string | null = partner || null

/** "Tú y Ana", o "Los dos" si no hay nombre configurado. */
export const US = PARTNER_NAME ? `Tú y ${PARTNER_NAME}` : 'Los dos'

/** "para ti y Ana", o "para los dos". */
export const FOR_US = PARTNER_NAME ? `para ti y ${PARTNER_NAME}` : 'para los dos'
