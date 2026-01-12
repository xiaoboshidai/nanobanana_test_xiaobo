"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { getSupabaseConfig } from "@/lib/supabase/env"

export function GoogleSignInButton() {
  const isConfigured = Boolean(getSupabaseConfig())

  const signIn = async () => {
    if (!isConfigured) {
      window.alert("未配置 Supabase：请先在 .env.local 中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。")
      return
    }
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <Button variant="outline" onClick={signIn} disabled={!isConfigured}>
      使用 Google 登录
    </Button>
  )
}
