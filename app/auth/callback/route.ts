import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { getSupabaseConfig } from "@/lib/supabase/env"

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

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/"

  const config = getSupabaseConfig()
  if (!config) return NextResponse.redirect(new URL("/", url.origin))

  const response = NextResponse.redirect(new URL(next, url.origin))

  if (code) {
    const supabase = createServerClient(config.url, config.anonKey, {
      global: { fetch: fetchWithTimeout },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options)
        },
      },
    })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return response
}
