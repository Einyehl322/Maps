import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase. Si faltan las variables de entorno la app funciona
 * en modo local (IndexedDB, solo en este navegador) y `supabase` es `null`.
 */

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null

export const isCloud = supabase !== null

/** Bucket privado donde viven las fotos. */
export const PHOTO_BUCKET = 'photos'
