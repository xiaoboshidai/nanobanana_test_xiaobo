import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "内测用户 A",
    role: "内容创作者",
    content: "上手简单，适合做试验和灵感草图。",
  },
  {
    name: "内测用户 B",
    role: "设计从业者",
    content: "提示词越清晰，输出越稳定。希望后续能加入更多预设风格。",
  },
  {
    name: "内测用户 C",
    role: "摄影爱好者",
    content: "常用场景替换和简单修图够用，等待更多专业功能。",
  },
]

export function ReviewsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">用户评价</h2>
          <p className="text-xl text-muted-foreground text-balance">内测反馈（示例，仅用于展示）</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="p-6 space-y-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">"{review.content}"</p>

              <div className="flex items-center gap-3 pt-4">
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
