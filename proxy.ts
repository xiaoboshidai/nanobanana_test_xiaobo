import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

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

export async function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next()
  if (request.nextUrl.pathname.startsWith("/auth/callback")) return NextResponse.next()

  let response = NextResponse.next()

  const config = getSupabaseConfig()
  if (!config) return response

  const hasSupabaseAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") || c.name.includes("supabase") || c.name.includes("auth-token"))
  if (!hasSupabaseAuthCookie) return response

  const supabase = createServerClient(config.url, config.anonKey, {
    global: { fetch: fetchWithTimeout },
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        response = NextResponse.next()
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options)
      },
    },
  })

  try {
    await Promise.race([supabase.auth.getUser(), new Promise((resolve) => setTimeout(resolve, 2500))])
  } catch {
    // Supabase 不可达/超时时，不要阻塞整站请求
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
