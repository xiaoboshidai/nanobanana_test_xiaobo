import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreemPortalLink } from "@/components/creem/portal-link"
import { verifyCreemRedirectSignature } from "@/lib/creem/verify-redirect-signature"

export const runtime = "nodejs"

export const metadata = {
  title: "支付结果 - 智能图片编辑器",
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const paramsRecord = searchParams
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(paramsRecord)) {
    if (typeof value === "string") params.set(key, value)
    else if (Array.isArray(value)) value.forEach((v) => params.append(key, v))
  }

  const signatureCheck = verifyCreemRedirectSignature(params)
  const customerId = params.get("customer_id") ?? params.get("customerId") ?? ""
  const subscriptionId = params.get("subscription_id") ?? params.get("subscriptionId") ?? ""
  const orderId = params.get("order_id") ?? params.get("orderId") ?? ""

  const plan = params.get("plan") ?? ""
  const interval = params.get("interval") ?? ""

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">支付完成</h1>
            <p className="text-muted-foreground">感谢订阅，你的订单已处理。</p>
          </div>
          <Badge variant={signatureCheck.ok ? "default" : "destructive"}>
            {signatureCheck.ok ? "签名已验证" : "签名未验证"}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>订单信息</CardTitle>
            <CardDescription>如需排查问题，请把以下信息提供给客服。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground">订单</div>
              <div className="font-mono break-all">{orderId || "-"}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground">订阅</div>
              <div className="font-mono break-all">{subscriptionId || "-"}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground">客户</div>
              <div className="font-mono break-all">{customerId || "-"}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground">套餐</div>
              <div className="font-mono break-all">{plan ? `${plan}${interval ? ` (${interval})` : ""}` : "-"}</div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/">返回首页</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/pricing">查看定价</Link>
              </Button>
              {customerId ? <CreemPortalLink customerId={customerId} /> : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
