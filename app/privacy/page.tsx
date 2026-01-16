import Link from "next/link"

const SUPPORT_EMAIL = "xiaobo@nanobananaxiaobotest.online"

export const metadata = {
  title: "隐私政策 - 智能图片编辑器",
  description: "了解我们如何收集、使用与保护你的信息。",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl px-4 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">隐私政策</h1>
          <p className="text-sm text-muted-foreground">最后更新：2026-01-15</p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">1. 我们收集哪些信息</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>账户信息：例如登录邮箱（由身份验证服务提供）。</li>
            <li>内容数据：你上传的图片、编辑指令/提示词及生成结果（用于提供与改进服务）。</li>
            <li>日志与设备信息：例如 IP、浏览器信息、访问记录（用于安全、故障排查与性能优化）。</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">2. 我们如何使用信息</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>提供、维护与改进产品功能；</li>
            <li>安全风控、滥用检测、故障排查；</li>
            <li>客户支持与沟通；</li>
            <li>支付与订阅管理（由第三方支付/订阅平台处理）。</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">3. 第三方服务</h2>
          <p>我们可能使用第三方服务来提供核心能力，包括但不限于：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>身份验证/数据库（例如 Supabase）；</li>
            <li>支付与订阅管理（例如 Creem）；</li>
            <li>分析与监控（例如 Vercel Analytics）；</li>
            <li>AI 模型/推理服务（用于图片编辑与生成）。</li>
          </ul>
          <p>
            第三方服务会按照其各自政策处理数据。我们建议你同时阅读本服务条款与{" "}
            <Link href="/terms" className="text-primary hover:underline">
              服务条款
            </Link>
            。
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">4. 支付信息</h2>
          <p>我们不直接存储你的银行卡/支付账户信息。支付由第三方平台处理。</p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">5. 数据保留与删除</h2>
          <p>我们会在实现本政策所述目的所需的最短期限内保留数据，并采取合理措施保护数据安全。</p>
          <p>如需删除账户或数据请求，请邮件联系 {SUPPORT_EMAIL}。</p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">6. 联系方式</h2>
          <p>
            如对隐私政策有疑问，请联系：{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
            。
          </p>
        </section>
      </div>
    </main>
  )
}
