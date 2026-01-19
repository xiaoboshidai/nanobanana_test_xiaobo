import { Card } from "@/components/ui/card"
import { MessageSquare, Users, Layers, Zap, Images, Sparkles } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "自然语言编辑",
    description: "使用简单的文字提示编辑图片。支持更清晰的约束与多次迭代来逐步逼近预期。",
  },
  {
    icon: Users,
    title: "角色一致性",
    description: "在编辑过程中尽量保持角色特征与细节（效果会因素材与提示词而异）。",
  },
  {
    icon: Layers,
    title: "场景保留",
    description: "尽量让编辑结果与原始背景自然融合，适用于常见的场景替换与局部修改。",
  },
  {
    icon: Zap,
    title: "一键编辑",
    description: "提供一键编辑流程；你也可以通过补充细节与多次尝试来优化结果。",
  },
  {
    icon: Images,
    title: "多图上下文",
    description: "同时处理多张图片。支持高级多图编辑工作流程",
  },
  {
    icon: Sparkles,
    title: "AI内容创作",
    description: "用于创作一致的 AI 虚拟形象与 UGC 内容，适合社交媒体与营销素材制作。",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">核心功能</h2>
          <p className="text-xl text-muted-foreground text-balance">
            自然语言驱动的图片编辑体验：上传图片、描述目标、迭代优化。
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
