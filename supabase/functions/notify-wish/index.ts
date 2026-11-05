// Supabase Edge Function: avisa por correo cuando alguien marca un lugar
// como "queremos ir". La llama la app justo después de guardar.
//
// Secretos (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY  clave de https://resend.com (obligatoria)
//   APP_URL         URL de la app en Vercel, para el botón del correo (opcional)
//   MAIL_FROM       remitente; por defecto el de pruebas de Resend (opcional)
//
// SUPABASE_URL, SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY ya los pone Supabase.

import { createClient } from 'npm:@supabase/supabase-js@2.119.0'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const PRICE_LABELS: Record<number, string> = {
  1: 'menos de S/ 30 por persona',
  2: 'S/ 30 a 70 por persona',
  3: 'S/ 70 a 150 por persona',
  4: 'menú degustación, S/ 150+ por persona',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

function escape(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'method' }, 405)

  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (!resendKey) return json({ error: 'Falta el secreto RESEND_API_KEY' }, 500)

  const url = Deno.env.get('SUPABASE_URL')!
  const authorization = req.headers.get('Authorization') ?? ''

  // Cliente con la sesión de quien llama: las políticas de seguridad deciden
  // si puede ver el lugar (solo los miembros).
  const asCaller = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
  })
  const { data: auth } = await asCaller.auth.getUser()
  const caller = auth.user
  if (!caller?.email) return json({ error: 'Sin sesión' }, 401)

  let placeId: unknown
  try {
    placeId = (await req.json()).placeId
  } catch {
    return json({ error: 'JSON inválido' }, 400)
  }
  if (typeof placeId !== 'string') return json({ error: 'Falta placeId' }, 400)

  const { data: place } = await asCaller
    .from('places')
    .select('name, address, cuisine, status, price_level, message, lat, lng')
    .eq('id', placeId)
    .maybeSingle()
  if (!place) return json({ error: 'Lugar no encontrado' }, 404)
  if (place.status !== 'wishlist') return json({ skipped: 'no es "queremos ir"' })

  // La lista de miembros solo la lee el servidor.
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: members, error: membersError } = await admin
    .from('members')
    .select('email, name')
  if (membersError) return json({ error: membersError.message }, 500)

  const me = caller.email.toLowerCase()
  const author = members?.find((member) => member.email === me)
  const recipients = (members ?? [])
    .map((member) => member.email)
    .filter((email) => email !== me)
  if (!recipients.length) return json({ skipped: 'nadie más a quien avisar' })

  const who = author?.name?.trim() || me.split('@')[0]
  const appUrl = Deno.env.get('APP_URL')
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.name}, ${place.address ?? 'Lima'}`,
  )}`

  const details = [
    place.cuisine,
    place.address,
    place.price_level ? PRICE_LABELS[place.price_level] : null,
  ].filter(Boolean)

  const html = `
<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;background:#fffdfa;color:#241a17">
  <p style="margin:0 0 4px;font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#a72c43">Nuestros lugares</p>
  <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2">${escape(who)} quiere ir a ${escape(place.name)} ♥</h1>
  ${
    place.message
      ? `<blockquote style="margin:0 0 16px;padding:12px 16px;border-left:3px solid #d6455d;background:#fde9ed;border-radius:8px;font-style:italic;font-size:16px">💌 ${escape(place.message)}</blockquote>`
      : ''
  }
  ${details.length ? `<p style="margin:0 0 20px;font:14px Arial,sans-serif;color:#4a3f3b">${details.map((item) => escape(String(item))).join(' · ')}</p>` : ''}
  ${appUrl ? `<a href="${escape(appUrl)}" style="display:inline-block;margin-right:8px;padding:10px 18px;border-radius:99px;background:#d6455d;color:#fff;font:600 14px Arial,sans-serif;text-decoration:none">Abrir nuestro mapa</a>` : ''}
  <a href="${escape(mapsUrl)}" style="display:inline-block;padding:10px 18px;border-radius:99px;border:1px solid #ece1d8;color:#241a17;font:600 14px Arial,sans-serif;text-decoration:none">Ver en Google Maps</a>
</div>`

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: Deno.env.get('MAIL_FROM') ?? 'Nuestros lugares <onboarding@resend.dev>',
      to: recipients,
      subject: `💌 ${who} quiere ir a ${place.name}`,
      html,
    }),
  })

  if (!response.ok) {
    return json({ error: `Resend respondió ${response.status}: ${await response.text()}` }, 502)
  }
  return json({ sent: recipients.length })
})
