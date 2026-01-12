import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { requireSupabaseConfig } from "@/lib/supabase/env"

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController()
  const timeoutMs = 2500
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  const upstream = init?.signal
  if (upstream) {
    try {
      if (upstream.aborted) controller.abort()
      else upstream.addEventListener("abort", () => controller.abort(), { once: true })
    } catch {
      // ignore
    }
  }
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeout))
}

export async function createClient() {
  const cookieStore = await cookies()
  const { url, anonKey } = requireSupabaseConfig()

  return createServerClient(url, anonKey, {
    global: { fetch: fetchWithTimeout },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options)
        } catch {
          // 可能在 Server Component 中被调用（只读 cookies），忽略即可
        }
      },
    },
  })
}
