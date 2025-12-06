import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // 1. Ahora esperamos (await) a las cookies
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 2. Usamos la nueva sintaxis getAll para leer
        getAll() {
          return cookieStore.getAll()
        },
        // 3. Usamos setAll para escribir (maneja cookies en lote)
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // El método setAll se invocó desde un Server Component.
            // Esto se ignora con seguridad.
          }
        },
      },
    }
  )
}