import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function initSupabase(): SupabaseClient | null {
  try {
    if (!url || !key || url.includes('your-supabase')) return null
    new URL(url) // validate URL
    return createClient(url, key)
  } catch {
    return null
  }
}

export const supabase = initSupabase()
