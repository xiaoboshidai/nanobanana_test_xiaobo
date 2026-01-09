import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-background pt-20 pb-32">
      {/* Banana decorations */}
      <div className="absolute top-10 right-10 opacity-20 text-9xl animate-bounce-slow">🍌</div>
      <div
        className="absolute bottom-20 left-10 opacity-10 text-7xl animate-bounce-slow"
        style={{ animationDelay: "1s" }}
      >
        🍌
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            全新AI图片编辑器上线
            <span className="text-2xl">🍌</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">智能香蕉编辑器</h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
            使用简单的文字描述即可编辑图片。智能香蕉的先进AI模型提供一致的角色编辑和场景保留功能，体验AI图片编辑的未来
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="text-lg px-8 gap-2" asChild>
              <Link href="#editor">
                开始编辑 <span className="text-xl">🍌</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 gap-2 bg-transparent" asChild>
              <Link href="#showcase">
                查看案例 <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Features list */}
          <div className="flex flex-wrap gap-6 justify-center pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              一键编辑
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              多图支持
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              自然语言
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
