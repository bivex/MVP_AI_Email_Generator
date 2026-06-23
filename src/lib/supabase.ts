import { createClient } from "@supabase/supabase-js"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  // Check if we are running in Next.js server context where next/headers is available
  try {
    const { cookies } = require("next/headers")
    return createRouteHandlerClient({ cookies })
  } catch (error) {
    // Fallback to static client (client-side or when cookies() is not available)
    return createClient(supabaseUrl, supabaseAnonKey)
  }
}

