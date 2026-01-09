import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

const showcaseItems = [
  {
    title: "超快山景生成",
    description: "使用智能香蕉优化的神经引擎在0.8秒内创建",
    image: "/majestic-mountain-vista.png",
  },
  {
    title: "即时花园创作",
    description: "使用智能香蕉技术在毫秒内渲染复杂场景",
    image: "/beautiful-garden.jpg",
  },
  {
    title: "实时海滩合成",
    description: "智能香蕉以闪电般的速度提供逼真的结果",
    image: "/tropical-beach-sunset.png",
  },
  {
    title: "快速极光生成",
    description: "使用智能香蕉AI即时处理高级效果",
    image: "/aurora-borealis-night-sky.png",
  },
]

export function ShowcaseSection() {
  return (
    <section id="showcase" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">案例展示</h2>
          <p className="text-xl text-muted-foreground text-balance">看看智能香蕉在毫秒内生成的闪电般快速的AI创作</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden group">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  智能香蕉速度
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">亲自体验智能香蕉的强大功能</p>
          <Button size="lg" className="gap-2" asChild>
            <a href="#editor">
              尝试智能香蕉编辑器 <span className="text-xl">🍌</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
