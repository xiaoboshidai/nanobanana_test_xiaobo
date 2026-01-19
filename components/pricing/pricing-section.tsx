"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Check, Crown, Sparkles, Users } from "lucide-react"
import { CreemCheckout } from "@creem_io/nextjs"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { getCreemProductId, type BillingInterval, type PlanKey } from "@/lib/creem/public-config"
import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { createClient } from "@/lib/supabase/client"
import { getSupabaseConfig } from "@/lib/supabase/env"

type User = { id: string; email?: string | null }

type Plan = {
  key: PlanKey
  name: string
  description: string
  icon: React.ReactNode
  highlight?: string
  price: { month: string; year: string }
  features: string[]
}

const plans: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    description: "适合个人尝鲜与轻度使用",
    icon: <Sparkles className="h-5 w-5" />,
    price: { month: "¥19", year: "¥190" },
    features: ["更快的生成速度", "更高的并发", "基础商业使用", "邮件支持"],
  },
  {
    key: "pro",
    name: "Pro",
    description: "高频创作与稳定生产",
    icon: <Crown className="h-5 w-5" />,
    highlight: "最受欢迎",
    price: { month: "¥49", year: "¥490" },
    features: ["更高质量模型", "更大尺寸输出", "优先队列", "高级商业使用", "优先支持"],
  },
  {
    key: "team",
    name: "Team",
    description: "团队协作与统一账单",
    icon: <Users className="h-5 w-5" />,
    price: { month: "¥199", year: "¥1990" },
    features: ["多成员席位", "团队资源池", "统一发票/账单", "SLA 支持", "专属对接"],
  },
]

function intervalLabel(interval: BillingInterval) {
  return interval === "month" ? "月付" : "年付"
}

export function PricingSection() {
  const [interval, setInterval] = useState<BillingInterval>("month")

  const isSupabaseConfigured = Boolean(getSupabaseConfig())
  const supabase = useMemo(() => (isSupabaseConfigured ? createClient() : null), [isSupabaseConfigured])

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!supabase) return
    let isMounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return
      setUser((data.user as any) || null)
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
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center space-y-4 mb-10">
          <Badge variant="secondary" className="gap-2">
            <Sparkles className="h-4 w-4" />
            定价
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">选择适合你的套餐</h1>
          <p className="text-muted-foreground text-lg text-balance">
            按需升级；随时取消。你可以先从免费功能开始体验，再选择合适的订阅。
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={cn("text-sm", interval === "month" ? "text-foreground" : "text-muted-foreground")}>月付</span>
          <Switch checked={interval === "year"} onCheckedChange={(checked) => setInterval(checked ? "year" : "month")} />
          <span className={cn("text-sm", interval === "year" ? "text-foreground" : "text-muted-foreground")}>
            年付 <span className="ml-1 text-xs text-primary">(省 2 个月)</span>
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Free</span>
              </CardTitle>
              <CardDescription>试用与基本功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold">¥0</div>
                <div className="text-sm text-muted-foreground">永久</div>
              </div>
              <ul className="space-y-2 text-sm">
                {["基础编辑功能", "公开模型与队列", "社区支持"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/#editor">开始使用</Link>
              </Button>
            </CardFooter>
          </Card>

          {plans.map((plan) => {
            const productId = getCreemProductId(plan.key, interval)
            const isConfigured = Boolean(productId)

            return (
              <Card key={plan.key} className={cn(plan.key === "pro" && "border-primary/50 shadow-md")}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center rounded-md bg-primary/10 text-primary p-2">
                        {plan.icon}
                      </span>
                      {plan.name}
                    </span>
                    {plan.highlight ? <Badge className="shrink-0">{plan.highlight}</Badge> : null}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="text-4xl font-bold">{interval === "month" ? plan.price.month : plan.price.year}</div>
                    <div className="text-sm text-muted-foreground">/{intervalLabel(interval)}</div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  {isConfigured ? (
                    user ? (
                      <CreemCheckout
                        productId={productId!}
                        successUrl={`/success?plan=${plan.key}&interval=${interval}`}
                        customer={user.email ? { email: user.email } : undefined}
                        metadata={{
                          plan: plan.key,
                          interval,
                          referenceId: user.id,
                        }}
                      >
                        <Button asChild className="w-full">
                          <span>立即订阅</span>
                        </Button>
                      </CreemCheckout>
                    ) : (
                      <div className="w-full">
                        <GoogleSignInButton />
                      </div>
                    )
                  ) : (
                    <Button className="w-full" disabled>
                      未配置产品 ID（NEXT_PUBLIC_CREEM_PRODUCT_*）
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    购买即表示你同意{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      服务条款
                    </Link>
                    、{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      隐私政策
                    </Link>
                    ，并了解{" "}
                    <Link href="/refunds" className="text-primary hover:underline">
                      退款政策
                    </Link>
                    。订阅后可在{" "}
                    <Link href="/account/billing" className="text-primary hover:underline">
                      订阅管理
                    </Link>{" "}
                    中进入客户门户取消订阅。
                  </p>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <div className="mt-14 rounded-xl border bg-muted/30 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="font-semibold">需要定制方案？</div>
            <div className="text-sm text-muted-foreground">支持按量、私有化、团队席位与发票等需求。</div>
          </div>
          <Button asChild variant="outline">
            <a href="mailto:xiaobo@nanobananaxiaobotest.online">联系支持</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
