import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (typeof url !== "string" || !url) {
    throw new Error("未配置 Supabase：请设置 NEXT_PUBLIC_SUPABASE_URL。")
  }
  if (typeof serviceRoleKey !== "string" || !serviceRoleKey) {
    throw new Error("未配置 Supabase：请设置 SUPABASE_SERVICE_ROLE_KEY（仅服务端使用）。")
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

