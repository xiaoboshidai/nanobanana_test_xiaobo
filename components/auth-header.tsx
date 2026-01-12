"use client"

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { createClient } from "@/lib/supabase/client"
import { getSupabaseConfig } from "@/lib/supabase/env"

type User = { id: string; email?: string | null }

export function AuthHeader() {
  const isConfigured = Boolean(getSupabaseConfig())
  const supabase = useMemo(() => (isConfigured ? createClient() : null), [isConfigured])

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(isConfigured)

  useEffect(() => {
    if (!supabase) return

    let isMounted = true
    setIsLoading(true)

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!isMounted) return
        setUser(data.user as any)
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as any) || null)
    })

    return () => {
      isMounted = false
      subscription?.subscription?.unsubscribe()
    }
  }, [supabase])

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="font-semibold">智能图片编辑器</div>
        <div className="flex items-center gap-3">
          {!isConfigured ? (
            <div className="text-sm text-muted-foreground">未配置 Supabase（请设置 `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`）</div>
          ) : isLoading ? (
            <div className="text-sm text-muted-foreground">正在读取登录状态…</div>
          ) : user ? (
            <>
              <div className="text-sm text-muted-foreground max-w-[280px] truncate">{user.email ?? user.id}</div>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  try {
                    await supabase?.auth.signOut()
                    setUser(null)
                  } catch {
                    window.alert("退出登录失败，请重试。")
                  }
                }}
              >
                退出登录
              </Button>
            </>
          ) : (
            <GoogleSignInButton />
          )}
        </div>
      </div>
    </header>
  )
}
