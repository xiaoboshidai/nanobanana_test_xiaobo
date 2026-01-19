"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { getSupabaseConfig } from "@/lib/supabase/env"

export function SubscriptionManageButton({ className }: { className?: string }) {
  const router = useRouter()
  const isConfigured = Boolean(getSupabaseConfig())
  const supabase = useMemo(() => (isConfigured ? createClient() : null), [isConfigured])

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      disabled={!isConfigured}
      onClick={async () => {
        if (!supabase) {
          window.alert("未配置 Supabase：请先设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。")
          return
        }

        const { data } = await supabase.auth.getUser()
        const user = data.user
        if (user) {
          router.push("/account/billing")
          return
        }

        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/account/billing`,
          },
        })
      }}
    >
      订阅管理
    </Button>
  )
}

