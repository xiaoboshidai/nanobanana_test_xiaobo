import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "张艺术家",
    role: "数字创作者",
    content: "这个编辑器彻底改变了我的工作流程。角色一致性令人难以置信 - 远远领先于其他编辑器！",
    avatar: "/asian-male-artist.jpg",
  },
  {
    name: "李创作者",
    role: "UGC专家",
    content: "创建一致的AI虚拟形象从未如此简单。它能完美保持面部细节！",
    avatar: "/asian-female-content-creator.jpg",
  },
  {
    name: "王编辑",
    role: "专业编辑师",
    content: "使用这个工具，一键编辑基本上已经解决了。场景融合非常自然和逼真！",
    avatar: "/asian-male-photo-editor.jpg",
  },
]

export function ReviewsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">用户评价</h2>
          <p className="text-xl text-muted-foreground text-balance">创作者们的真实评价</p>
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
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
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
