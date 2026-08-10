import { categoryOf, LIMA_RECOMMENDATIONS, type Recommendation } from './lima'
import type { Restaurant } from './types'
import { newId } from './types'

/**
 * Arranque rápido: seis clásicos limeños sacados de la guía, para que el mapa
 * no empiece vacío. Son sitios reales; las notas de los platos son de ejemplo
 * y están para que veas cómo queda una ficha (se editan o se borran).
 */

const VISITED: Record<string, { name: string; rating: number; notes?: string }[]> = {
  'al-toke-pez': [
    { name: 'Combinado', rating: 5, notes: 'Cebiche, chaufa y tallarín saltado en un plato. Imbatible por el precio.' },
    { name: 'Jalea', rating: 4, notes: 'Frita al momento, mejor si llegas temprano.' },
  ],
  'el-chinito': [
    { name: 'Pan con chicharrón', rating: 5, notes: 'Con camote frito y salsa criolla. El desayuno.' },
  ],
  isolina: [
    { name: 'Cau cau de mondonguito', rating: 4, notes: 'Fuente para dos como mínimo.' },
    { name: 'Tallarín rojo con asado', rating: 5 },
  ],
}

const WISHLIST = ['central', 'maido', 'la-picanteria']

export function DEMO_RESTAURANTS(): Restaurant[] {
  const now = new Date().toISOString()

  const build = (rec: Recommendation): Restaurant => {
    const dishes = (VISITED[rec.id] ?? []).map((dish) => ({
      id: newId(),
      name: dish.name,
      rating: dish.rating,
      notes: dish.notes,
      createdAt: now,
    }))

    return {
      id: newId(),
      recId: rec.id,
      name: rec.name,
      status: dishes.length ? 'visited' : 'wishlist',
      address: `${rec.address}, ${rec.district}`,
      cuisine: categoryOf(rec.category).cuisine,
      lng: rec.lng,
      lat: rec.lat,
      visitedAt: dishes.length ? '2026-07-12' : undefined,
      notes: `${rec.about}\n\nQué pedir: ${rec.dishes.join(', ')}.`,
      dishes,
      createdAt: now,
      updatedAt: now,
    }
  }

  const ids = [...Object.keys(VISITED), ...WISHLIST]
  return LIMA_RECOMMENDATIONS.filter((rec) => ids.includes(rec.id)).map(build)
}
