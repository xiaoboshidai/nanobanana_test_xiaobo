import { Card } from "@/components/ui/card"
import { MessageSquare, Users, Layers, Zap, Images, Sparkles } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "自然语言编辑",
    description: "使用简单的文字提示编辑图片。智能香蕉AI能理解复杂的指令，就像图片版的GPT",
  },
  {
    icon: Users,
    title: "角色一致性",
    description: "在编辑过程中完美保持角色细节。这个模型擅长保留面部和身份特征",
  },
  {
    icon: Layers,
    title: "场景保留",
    description: "将编辑无缝融合到原始背景中。比其他模型有更出色的场景融合效果",
  },
  {
    icon: Zap,
    title: "一键编辑",
    description: "一次尝试就能获得完美结果。智能香蕉轻松解决一键图片编辑的挑战",
  },
  {
    icon: Images,
    title: "多图上下文",
    description: "同时处理多张图片。支持高级多图编辑工作流程",
  },
  {
    icon: Sparkles,
    title: "AI内容创作",
    description: "创建一致的AI虚拟形象和UGC内容。完美适用于社交媒体和营销活动",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">核心功能</h2>
          <p className="text-xl text-muted-foreground text-balance">
            为什么选择智能香蕉？智能香蕉是最先进的AI图片编辑器，通过自然语言理解革新照片编辑
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
