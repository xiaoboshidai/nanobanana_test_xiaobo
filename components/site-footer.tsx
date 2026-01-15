import Link from "next/link"

const SUPPORT_EMAIL = "libo86874@gmail.com"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="space-y-2">
            <div className="font-semibold">智能图片编辑器</div>
            <p className="text-sm text-muted-foreground max-w-xl">
              提供基于第三方 AI 模型的图片编辑能力。我们与 OpenAI、Google 或任何模型提供方无隶属/背书关系。
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="font-medium">产品</div>
              <div className="flex flex-col gap-1 text-muted-foreground">
                <Link href="/pricing" className="hover:text-foreground">
                  定价
                </Link>
                <Link href="/#editor" className="hover:text-foreground">
                  编辑器
                </Link>
                <Link href="/account/billing" className="hover:text-foreground">
                  订阅管理
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">合规</div>
              <div className="flex flex-col gap-1 text-muted-foreground">
                <Link href="/terms" className="hover:text-foreground">
                  服务条款
                </Link>
                <Link href="/privacy" className="hover:text-foreground">
                  隐私政策
                </Link>
                <Link href="/refunds" className="hover:text-foreground">
                  退款政策
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">支持</div>
              <div className="flex flex-col gap-1 text-muted-foreground">
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-foreground">
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} 智能图片编辑器</div>
          <div>如需退款或订阅帮助，请发送邮件至 {SUPPORT_EMAIL}</div>
        </div>
      </div>
    </footer>
  )
}

