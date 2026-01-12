function getSupabaseAnonKeyOptional() {
  const candidates = [
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ]
  return candidates.find((v) => typeof v === "string" && v) || null
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = getSupabaseAnonKeyOptional()
  if (typeof url !== "string" || !url || !anonKey) return null
  return { url, anonKey }
}

export function requireSupabaseConfig() {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error(
      "未配置 Supabase：请设置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY（或 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY）",
    )
  }
  return config
}
