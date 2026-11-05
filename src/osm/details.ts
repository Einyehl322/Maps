import { useEffect, useState } from 'react'

/**
 * Datos de contacto del local real, leídos de la API de OpenStreetMap
 * (rápida y fiable, a diferencia de Overpass). Se consultan al abrir la
 * ficha, así que siempre están al día con lo que haya en OSM.
 */

export type OsmDetails = {
  website?: string
  phone?: string
  instagram?: string
  facebook?: string
  menu?: string
  /** Ya traducido: "Lun-Vie 09:30-22:00; Dom 09:30-18:00". */
  openingHours?: string
}

const API = 'https://api.openstreetmap.org/api/0.6'
const cache = new Map<string, Promise<OsmDetails | null>>()

const DAYS: Record<string, string> = {
  Mo: 'Lun',
  Tu: 'Mar',
  We: 'Mié',
  Th: 'Jue',
  Fr: 'Vie',
  Sa: 'Sáb',
  Su: 'Dom',
  PH: 'Feriados',
}

/** "Mo-Fr 09:30-22:00; Su off" → "Lun-Vie 09:30-22:00; Dom cerrado". */
export function translateHours(value: string): string {
  return value
    .replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su|PH)\b/g, (day) => DAYS[day])
    .replace(/\boff\b/g, 'cerrado')
    .replace(/24\/7/g, 'Abierto 24 horas')
}

/** Acepta "@usuario", "usuario" o una URL completa de Instagram/Facebook. */
function socialUrl(value: string | undefined, host: string): string | undefined {
  const raw = value?.trim()
  if (!raw) return undefined
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://www.${host}/${raw.replace(/^@/, '')}`
}

export function normalizeUrl(value: string | undefined): string | undefined {
  const raw = value?.trim()
  if (!raw) return undefined
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
}

async function load(osmId: string): Promise<OsmDetails | null> {
  // Solo "node/123", "way/456" o "relation/789": nada más llega a la URL.
  if (!/^(node|way|relation)\/\d+$/.test(osmId)) return null
  const response = await fetch(`${API}/${osmId}.json`)
  if (!response.ok) return null
  const data: { elements?: { tags?: Record<string, string> }[] } = await response.json()
  const tags = data.elements?.[0]?.tags
  if (!tags) return null

  return {
    website: normalizeUrl(tags.website ?? tags['contact:website']),
    phone: (tags.phone ?? tags['contact:phone'])?.split(';')[0].trim(),
    instagram: socialUrl(tags['contact:instagram'] ?? tags.instagram, 'instagram.com'),
    facebook: socialUrl(tags['contact:facebook'] ?? tags.facebook, 'facebook.com'),
    menu: normalizeUrl(tags['website:menu'] ?? tags.menu_url),
    openingHours: tags.opening_hours ? translateHours(tags.opening_hours) : undefined,
  }
}

export function fetchOsmDetails(osmId: string): Promise<OsmDetails | null> {
  let hit = cache.get(osmId)
  if (!hit) {
    hit = load(osmId).catch(() => null)
    cache.set(osmId, hit)
  }
  return hit
}

export function useOsmDetails(osmId: string | undefined): OsmDetails | null {
  const [state, setState] = useState<{ id: string; details: OsmDetails } | null>(null)

  useEffect(() => {
    if (!osmId) return
    let cancelled = false
    void fetchOsmDetails(osmId).then((details) => {
      if (!cancelled && details) setState({ id: osmId, details })
    })
    return () => {
      cancelled = true
    }
  }, [osmId])

  return state && state.id === osmId ? state.details : null
}
