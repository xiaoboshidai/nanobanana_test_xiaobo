import Link from "next/link"

const SUPPORT_EMAIL = "xiaobo@nanobananaxiaobotest.online"

export const metadata = {
  title: "退款政策 - 智能图片编辑器",
  description: "了解取消订阅与退款规则。",
}

export default function RefundsPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl px-4 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">退款政策</h1>
          <p className="text-sm text-muted-foreground">最后更新：2026-01-15</p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">1. 取消订阅</h2>
          <p>
            你可以随时在产品内进入“订阅管理”打开客户门户取消订阅。取消后通常在当前计费周期结束前仍可继续使用已购买权益（具体以客户门户显示为准）。
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">2. 退款申请</h2>
          <p>
            若你遇到误扣费、重复扣费或服务无法正常使用等情况，可通过邮件联系 {SUPPORT_EMAIL} 申请协助处理。
          </p>
          <p>我们通常会在 3 个工作日内回复并协助推进处理（具体处理结果可能受支付平台规则影响）。</p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">3. 联系方式</h2>
          <p>
            退款与账单支持请联系：{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
            。
          </p>
          <p className="text-muted-foreground">
            相关条款请参见{" "}
            <Link href="/terms" className="text-primary hover:underline">
              服务条款
            </Link>
            。
          </p>
        </section>
      </div>
    </main>
  )
}
