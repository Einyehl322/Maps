// Supabase Edge Function: busca en internet la carta de un lugar y devuelve
// cada plato/bebida con su precio en soles, para cotizar cosa por cosa.
//
// Sirve para un lugar guardado ({ placeId }) o para uno de la guía de Lima,
// que no está en la base de datos ({ rec: { id, name, address, district } }).
//
// Usa Claude con búsqueda web. Cuesta dinero en cada búsqueda nueva, así que
// el resultado se guarda en `menu_lookups` y se reutiliza durante 30 días
// (salvo que se pida "buscar de nuevo").
//
// Secretos (Supabase → Edge Functions → Secrets):
//   ANTHROPIC_API_KEY  clave de https://console.anthropic.com (obligatoria)
//
// SUPABASE_URL, SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY ya los pone Supabase.

import Anthropic from 'npm:@anthropic-ai/sdk@1.6.0'
import { createClient } from 'npm:@supabase/supabase-js@2.119.0'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MODEL = 'claude-opus-5-5'
const CACHE_DAYS = 30
/** Tope de búsquedas por consulta: cada una cuesta US$0.01 más los tokens que lee. */
const MAX_SEARCHES = 4
const MAX_ROUNDS = 4

const CATEGORIES = ['entrada', 'fondo', 'postre', 'bebida', 'otro'] as const

type MenuItem = {
  name: string
  price: number
  category: (typeof CATEGORIES)[number]
  note: string | null
  source_url: string
}

type MenuReport = {
  found: boolean
  confidence: 'alta' | 'media' | 'baja'
  summary: string
  source_date: string | null
  items: MenuItem[]
}

// La herramienta con la que Claude entrega el resultado. `strict: true`
// garantiza que los argumentos cumplen el esquema.
const REPORT_TOOL: Anthropic.Beta.BetaTool = {
  name: 'report_menu',
  description:
    'Entrega la carta encontrada. Llámala una sola vez, al final, cuando ya tengas los precios (o cuando sepas que no hay).',
  strict: true,
  input_schema: {
    type: 'object',
    additionalProperties: false,
    required: ['found', 'confidence', 'summary', 'source_date', 'items'],
    properties: {
      found: {
        type: 'boolean',
        description: 'true si encontraste precios de ESTE local (o de su cadena en Lima).',
      },
      confidence: {
        type: 'string',
        enum: ['alta', 'media', 'baja'],
        description:
          'alta: carta oficial (web/Instagram del local) de los últimos 12 meses. media: app de delivery o fuente reciente no oficial. baja: fuentes antiguas, de otra sucursal o dudosas.',
      },
      summary: {
        type: 'string',
        description:
          'Una frase en español: de dónde salen los precios y qué tan actuales parecen. Ej. "Carta de su web oficial, actualizada en 2026".',
      },
      source_date: {
        type: ['string', 'null'],
        description: 'Fecha o año de la carta si aparece (ej. "2026-08" o "2025"); null si no se sabe.',
      },
      items: {
        type: 'array',
        description: 'Hasta 40 productos, los más representativos de la carta.',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['name', 'price', 'category', 'note', 'source_url'],
          properties: {
            name: { type: 'string', description: 'Nombre tal como aparece en la carta.' },
            price: { type: 'number', description: 'Precio en soles (S/), sin el símbolo.' },
            category: { type: 'string', enum: [...CATEGORIES] },
            note: {
              type: ['string', 'null'],
              description: 'Tamaño o detalle si importa ("para 2", "jarra 1 L"); null si no.',
            },
            source_url: { type: 'string', description: 'URL exacta donde viste ese precio.' },
          },
        },
      },
    },
  },
}

const SYSTEM = `Eres un asistente que busca precios de cartas de restaurantes en Lima, Perú.
Busca la carta del local indicado: su web oficial, su Instagram, apps de delivery (Rappi, PedidosYa) o reseñas recientes con precios.
Reglas:
- Comprueba que es ESE local (mismo nombre y distrito/dirección) o su cadena en Lima; no confundas con otro del mismo nombre.
- Solo precios en soles (S/) publicados. Nunca inventes, redondees ni estimes un precio: si no lo ves escrito, no lo pongas.
- Prefiere la carta oficial más reciente. Descarta fuentes de hace más de 2 años si hay otras. Si hay precios de delivery y de salón, usa los de salón y dilo en el resumen.
- Cada producto con la URL exacta donde aparece su precio.
- Califica la confianza con honestidad (alta / media / baja).
- Cuando termines, entrega el resultado con la herramienta report_menu.`

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

function findReport(content: Anthropic.Beta.BetaContentBlock[]): MenuReport | null {
  for (const block of content) {
    if (block.type === 'tool_use' && block.name === 'report_menu') {
      return block.input as MenuReport
    }
  }
  return null
}

/** Defensa extra: precios razonables y URLs http(s). */
function clean(report: MenuReport): MenuReport {
  const items = report.items
    .filter(
      (item) =>
        item.name.trim() &&
        Number.isFinite(item.price) &&
        item.price > 0 &&
        item.price < 5000 &&
        /^https?:\/\//i.test(item.source_url),
    )
    .slice(0, 40)
    .map((item) => ({ ...item, name: item.name.trim(), price: Math.round(item.price * 100) / 100 }))
  return { ...report, found: report.found && items.length > 0, items }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'method' }, 405)

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) return json({ error: 'Falta el secreto ANTHROPIC_API_KEY' }, 500)

  const url = Deno.env.get('SUPABASE_URL')!
  const asCaller = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  })
  const { data: auth } = await asCaller.auth.getUser()
  if (!auth.user?.email) return json({ error: 'Sin sesión' }, 401)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'JSON inválido' }, 400)
  }
  const force = body.force === true

  // Qué buscar: un lugar guardado o uno de la guía.
  let target: {
    key: string
    placeId: string | null
    name: string
    address?: string | null
    cuisine?: string | null
    website?: string | null
  }
  if (typeof body.placeId === 'string') {
    // Leer con la sesión de quien llama: si no es miembro, no ve el lugar.
    const { data: place } = await asCaller
      .from('places')
      .select('id, name, address, cuisine, website')
      .eq('id', body.placeId)
      .maybeSingle()
    if (!place) return json({ error: 'Lugar no encontrado' }, 404)
    target = { key: `place:${place.id}`, placeId: place.id, ...place }
  } else if (typeof body.rec === 'object' && body.rec !== null) {
    const rec = body.rec as Record<string, unknown>
    const text = (value: unknown) =>
      typeof value === 'string' && value.length <= 200 ? value : null
    if (typeof rec.id !== 'string' || !/^[a-z0-9-]{1,60}$/.test(rec.id) || !text(rec.name)) {
      return json({ error: 'Lugar de la guía inválido' }, 400)
    }
    const { data: member } = await asCaller.rpc('is_member')
    if (member !== true) return json({ error: 'Sin acceso' }, 403)
    target = {
      key: `rec:${rec.id}`,
      placeId: null,
      name: text(rec.name)!,
      address: [text(rec.address), text(rec.district)].filter(Boolean).join(', ') || null,
      cuisine: text(rec.cuisine),
    }
  } else {
    return json({ error: 'Falta placeId o rec' }, 400)
  }

  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  if (!force) {
    const { data: cached } = await admin
      .from('menu_lookups')
      .select('*')
      .eq('key', target.key)
      .maybeSingle()
    const fresh =
      cached && Date.now() - Date.parse(cached.searched_at) < CACHE_DAYS * 24 * 3600 * 1000
    if (fresh) return json({ ...cached, cached: true })
  }

  const client = new Anthropic({ apiKey })
  const request = [
    `Local: ${target.name}`,
    target.address && `Dirección: ${target.address}`,
    target.cuisine && `Tipo: ${target.cuisine}`,
    target.website && `Web conocida: ${target.website}`,
    'Busca su carta con precios actuales.',
  ]
    .filter(Boolean)
    .join('\n')

  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: 'user', content: request }]
  let report: MenuReport | null = null
  let searches = 0

  try {
    for (let round = 0; round < MAX_ROUNDS && !report; round += 1) {
      const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 16000,
        // Si el modelo declina por una política de seguridad, la API reintenta
        // sola con otro modelo (fallbacks), en la misma llamada.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        // Tarea acotada: esfuerzo bajo = más rápido y barato.
        output_config: { effort: 'low' },
        system: SYSTEM,
        tools: [
          {
            type: 'web_search_20260209',
            name: 'web_search',
            max_uses: MAX_SEARCHES,
            user_location: {
              type: 'approximate',
              city: 'Lima',
              region: 'Lima',
              country: 'PE',
              timezone: 'America/Lima',
            },
          },
          { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 3, max_content_tokens: 20000 },
          REPORT_TOOL,
        ],
        messages,
      })

      searches += response.usage.server_tool_use?.web_search_requests ?? 0

      if (response.stop_reason === 'refusal') {
        return json({ error: 'No se pudo buscar la carta de este lugar.' }, 422)
      }

      report = findReport(response.content)
      if (report) break

      messages.push({ role: 'assistant', content: response.content })
      // pause_turn: el bucle de búsqueda del servidor se pausó; reenviar tal cual lo reanuda.
      if (response.stop_reason === 'pause_turn') continue
      // Terminó sin entregar: pedirle que use la herramienta.
      messages.push({
        role: 'user',
        content: 'Entrega ahora lo que encontraste con la herramienta report_menu (aunque sea found=false).',
      })
    }
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return json({ error: 'La clave ANTHROPIC_API_KEY no es válida.' }, 500)
    }
    if (error instanceof Anthropic.RateLimitError) {
      return json({ error: 'Demasiadas búsquedas seguidas. Prueben en un minuto.' }, 429)
    }
    if (error instanceof Anthropic.APIError) {
      return json({ error: `Error del buscador (${error.status}).` }, 502)
    }
    throw error
  }

  if (!report) return json({ error: 'No se encontró la carta. Prueben de nuevo más tarde.' }, 502)

  const result = clean(report)
  const row = {
    key: target.key,
    place_id: target.placeId,
    name: target.name,
    found: result.found,
    confidence: result.found ? result.confidence : 'baja',
    summary: result.summary,
    source_date: result.source_date,
    items: result.items,
    searches,
    searched_at: new Date().toISOString(),
    searched_by: auth.user.email,
  }
  const { error: saveError } = await admin.from('menu_lookups').upsert(row)
  if (saveError) return json({ error: saveError.message }, 500)

  return json({ ...row, cached: false })
})
