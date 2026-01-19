import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreemPortalLink } from "@/components/creem/portal-link"
import { createClient } from "@/lib/supabase/server"
import { getBillingStateByUserId } from "@/lib/billing/billing-admin"

const SUPPORT_EMAIL = "xiaobo@nanobananaxiaobotest.online"

export const metadata = {
  title: "订阅管理 - 智能图片编辑器",
  description: "管理订阅、取消与账单问题。",
}

export default async function BillingPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    return (
      <main className="min-h-screen py-16">
        <div className="container mx-auto max-w-3xl px-4 space-y-6">
          <h1 className="text-3xl font-bold">订阅管理</h1>
          <Card>
            <CardHeader>
              <CardTitle>请先登录</CardTitle>
              <CardDescription>登录后才能查看订阅状态与进入客户门户管理订阅。</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild>
                <Link href="/pricing">去订阅</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">返回首页</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  let billingState = null as Awaited<ReturnType<typeof getBillingStateByUserId>>
  let billingLoadError: string | null = null
  try {
    billingState = await getBillingStateByUserId(user.id)
  } catch {
    billingState = null
    billingLoadError = "订阅同步暂不可用（可能未配置 SUPABASE_SERVICE_ROLE_KEY 或表结构）。"
  }
  const customerId = billingState?.creem_customer_id ?? null

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl px-4 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">订阅管理</h1>
          <p className="text-sm text-muted-foreground">你可以在客户门户中取消订阅、更新支付方式与查看账单记录。</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>当前状态</CardTitle>
            <CardDescription>如无法进入门户或状态异常，请联系支持邮箱。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {billingLoadError ? (
              <div className="rounded-md border bg-muted/30 p-3 text-muted-foreground">{billingLoadError}</div>
            ) : null}
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground">登录邮箱</div>
              <div>{user.email ?? "-"}</div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground">订阅状态</div>
              <div>{billingState?.creem_subscription_status ?? "未知（可能尚未产生订阅或未同步）"}</div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {customerId ? (
                <CreemPortalLink customerId={customerId} />
              ) : (
                <Button variant="outline" disabled>
                  暂无客户门户（请先完成一次订阅）
                </Button>
              )}

              <Button asChild variant="secondary">
                <Link href="/pricing">查看套餐</Link>
              </Button>
            </div>

            <div className="rounded-md border bg-muted/20 p-4 space-y-2">
              <div className="font-medium">如何取消订阅</div>
              <div className="text-muted-foreground">
                1) 完成订阅后回到本页；2) 点击“管理订阅”进入客户门户；3) 在客户门户中选择取消订阅（Cancel subscription）。
              </div>
              <div className="text-muted-foreground">
                如果本页没有出现“管理订阅”按钮（例如订阅尚未同步），请稍后刷新重试或联系支持邮箱。
              </div>
            </div>

            <div className="pt-3 text-muted-foreground">
              退款政策见{" "}
              <Link href="/refunds" className="text-primary hover:underline">
                /refunds
              </Link>
              ，支持邮箱：{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                {SUPPORT_EMAIL}
              </a>
              。
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
