import { GUIDE_MENU_SNAPSHOT } from './menuSnapshotGuide'
import type { MenuItem, MenuPrices } from './price'

/**
 * Cartas buscadas a mano (con búsqueda web) el 5 de noviembre de 2026, para
 * tener precios reales sin depender de la búsqueda automática.
 *
 * Reglas: solo precios publicados, cada uno con su fuente. Cuando la fuente da
 * un rango ("S/ 22 a 38"), se guarda el valor alto para no quedarse cortos y
 * el rango va en la nota. Una búsqueda nueva desde la app (Supabase) reemplaza
 * estas entradas.
 */

const SEARCHED_AT = '2026-11-05T12:00:00-05:00'

const LARCO_MAIN = 'https://cafe.museolarco.org/en/our-menu/main-courses/'
const LARCO_STARTERS = 'https://cafe.museolarco.org/en/our-menu/appetizers-starters/'
const LARCO_DESSERTS = 'https://cafe.museolarco.org/en/our-menu/desserts/'
const LARCO_DRINKS = 'https://cafe.museolarco.org/en/our-menu/brunch/'

const SONIA =
  'https://elcomercio.pe/provecho/listas-y-rankings/cebicherias-en-chorrillos-3-restaurantes-imperdibles-para-probar-comida-marina-cevicherias-lima-sur-verano-2023-noticia/'

const SURQUILLO = 'https://www.marvelousperu.com/blog/guia-mercado-gastronomico-surquillo/'

function item(
  name: string,
  price: number,
  category: MenuItem['category'],
  source_url: string,
  note: string | null = null,
): MenuItem {
  return { name, price, category, note, source_url }
}

const HAND_PICKED: Record<string, MenuPrices> = {
  'rec:museo-larco-cafe': {
    key: 'rec:museo-larco-cafe',
    found: true,
    confidence: 'alta',
    summary: 'Carta oficial de su web (cafe.museolarco.org), precios en soles con impuestos incluidos.',
    source_date: '2026',
    searched_at: SEARCHED_AT,
    items: [
      item('Causa limeña', 39, 'entrada', LARCO_STARTERS),
      item('Causa de langostinos', 47, 'entrada', LARCO_STARTERS),
      item('Cebiche limeño', 72, 'entrada', LARCO_STARTERS),
      item('Tequeños con queso andino', 39, 'entrada', LARCO_STARTERS),
      item('Ensalada César', 40, 'entrada', LARCO_STARTERS),
      item('Sopa del día', 35, 'entrada', LARCO_STARTERS),
      item('Canasta de pan', 12, 'entrada', LARCO_STARTERS),
      item('Lomo saltado', 72, 'fondo', LARCO_MAIN),
      item('Tacu tacu con lomo saltado', 72, 'fondo', LARCO_MAIN),
      item('Lomo a la pimienta', 72, 'fondo', LARCO_MAIN),
      item('Arroz con mariscos', 60, 'fondo', LARCO_MAIN),
      item('Pollo rostizado', 58, 'fondo', LARCO_MAIN),
      item('Pesca del día (sudado, oriental o en mantequilla)', 72, 'fondo', LARCO_MAIN),
      item('Salmón a la parrilla', 78, 'fondo', LARCO_MAIN),
      item('Asado de tira con puré', 74, 'fondo', LARCO_MAIN),
      item('Pato confitado', 107, 'fondo', LARCO_MAIN),
      item('Quinotto vegano al ají amarillo', 57, 'fondo', LARCO_MAIN),
      item('Spaghetti a la huancaína con langostinos', 65, 'fondo', LARCO_MAIN),
      item('Ñoquis de espinaca', 59, 'fondo', LARCO_MAIN),
      item('Suspiro limeño', 36, 'postre', LARCO_DESSERTS),
      item('Tres leches', 34, 'postre', LARCO_DESSERTS),
      item('Mousse de lúcuma', 34, 'postre', LARCO_DESSERTS),
      item('Tiramisú', 37, 'postre', LARCO_DESSERTS),
      item('Helados artesanales', 26, 'postre', LARCO_DESSERTS, '2 bolas'),
      item('Chicha morada o limonada', 13, 'bebida', LARCO_DRINKS),
      item('Limonadas de la casa', 15, 'bebida', LARCO_DRINKS),
      item('Jugo de fruta fresca', 18, 'bebida', LARCO_DRINKS),
      item('Gaseosa', 10, 'bebida', LARCO_DRINKS),
      item('Agua Munay', 12, 'bebida', LARCO_DRINKS),
      item('Café o espresso', 12, 'bebida', LARCO_DRINKS),
      item('Cappuccino', 16, 'bebida', LARCO_DRINKS),
    ],
  },

  'rec:sonia': {
    key: 'rec:sonia',
    found: true,
    confidence: 'baja',
    summary:
      'No publican su carta en internet. Precios de un artículo de El Comercio de 2022: hoy probablemente estén más altos. Restaurant Guru (oct. 2026) estima S/ 60–80 por persona. Solo almuerzo, sin reservas.',
    source_date: '2022',
    searched_at: SEARCHED_AT,
    items: [
      item('Ceviche (de la casa, mixto…)', 52, 'fondo', SONIA, 'los ceviches iban de S/ 39 a S/ 52 en 2022'),
      item(
        'Ronda fría',
        80,
        'entrada',
        SONIA,
        'para compartir: choritos, ceviche mixto, tiradito, pulpo al olivo y conchas negras (2022)',
      ),
      item('Chita al ajo', 130, 'otro', SONIA, 'pescado entero para compartir: S/ 108–130 según tamaño (2022)'),
    ],
  },

  'rec:mercado-surquillo': {
    key: 'rec:mercado-surquillo',
    found: true,
    confidence: 'media',
    summary:
      'Precios promedio de 2025 de una guía del mercado (Marvelous Peru); cada puesto cobra distinto. Se usa el valor alto de cada rango.',
    source_date: '2025',
    searched_at: SEARCHED_AT,
    items: [
      item('Ceviche clásico', 38, 'fondo', SURQUILLO, 'S/ 22–38 según el puesto'),
      item('Dúo marino', 48, 'fondo', SURQUILLO, 'S/ 32–48 según el puesto'),
      item('Plato a la carta (fondas, Mercado N.º 2)', 35, 'fondo', SURQUILLO, 'S/ 20–35'),
      item('Menú del día', 22, 'fondo', SURQUILLO, 'S/ 12–22'),
      item('Anticuchos', 12, 'otro', SURQUILLO, 'S/ 8–12, en los pasajes de alrededor'),
      item('Picarones', 8, 'postre', SURQUILLO, 'S/ 5–8'),
      item('Jugo simple', 10, 'bebida', SURQUILLO, 'S/ 7–10'),
      item('Jugo combinado', 15, 'bebida', SURQUILLO, 'S/ 10–15'),
    ],
  },
}

/** Todas las cartas conocidas: las de la guía y las revisadas a mano (que mandan). */
export const MENU_SNAPSHOT: Record<string, MenuPrices> = {
  ...GUIDE_MENU_SNAPSHOT,
  ...HAND_PICKED,
}
