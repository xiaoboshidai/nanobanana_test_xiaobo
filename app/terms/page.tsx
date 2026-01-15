import Link from "next/link"

const SUPPORT_EMAIL = "libo86874@gmail.com"

export const metadata = {
  title: "服务条款 - 智能图片编辑器",
  description: "使用本服务前请阅读服务条款。",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl px-4 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">服务条款</h1>
          <p className="text-sm text-muted-foreground">最后更新：2026-01-15</p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">1. 接受条款</h2>
          <p>
            访问或使用本网站/服务即表示你同意本条款。如你不同意，请停止使用。隐私处理请参见{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              隐私政策
            </Link>
            。
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">2. 服务说明</h2>
          <p>
            本服务提供图片上传、编辑与生成等功能，可能基于第三方 AI 模型/服务实现。我们与 OpenAI、Google
            或任何模型提供方无隶属、背书或赞助关系。
          </p>
          <p>我们可能随时更新、调整或停止部分功能，并尽力提前通知，但不保证不间断或无错误。</p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">3. 账户与登录</h2>
          <p>你需要提供真实、可用的登录信息。你应对账户下发生的活动负责，并妥善保管登录凭据。</p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">4. 付费、订阅与取消</h2>
          <p>
            付费与订阅由第三方支付/订阅平台处理。你可以在产品内通过“订阅管理”进入客户门户管理订阅与取消。
          </p>
          <p>
            取消订阅后，一般在当前计费周期结束前仍可继续使用已购买权益（具体以结算页面展示与客户门户为准）。
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">5. 退款</h2>
          <p>
            退款规则请参见{" "}
            <Link href="/refunds" className="text-primary hover:underline">
              退款政策
            </Link>
            。如需帮助，请邮件联系 {SUPPORT_EMAIL}。
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">6. 可接受使用</h2>
          <p>你不得使用本服务从事以下行为（包括但不限于）：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>违反法律法规或侵犯他人权利（著作权、商标权、肖像权、隐私权等）；</li>
            <li>生成/传播非法、暴力、极端主义、仇恨、骚扰或成人内容；</li>
            <li>上传你无权处理的图片或敏感个人信息；</li>
            <li>逆向工程、绕过限制、滥用接口或影响服务稳定性。</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">7. 输出内容与免责声明</h2>
          <p>
            AI 生成/编辑结果可能不准确、不完整或不适用于你的用途。你应自行审核输出并承担使用风险。
          </p>
          <p>在法律允许范围内，我们不对间接损失、利润损失或数据丢失承担责任。</p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold">8. 联系方式</h2>
          <p>
            如有问题，请联系：{" "}
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

