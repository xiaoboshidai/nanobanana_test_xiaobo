import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "什么是智能香蕉？",
    answer:
      "智能香蕉是一个革命性的AI图片编辑模型，使用自然语言提示转换照片。这是目前最强大的图片编辑模型，具有卓越的一致性。它在角色一致性编辑和场景保留方面的性能优于其他编辑器。",
  },
  {
    question: "它是如何工作的？",
    answer:
      '只需上传一张图片并用自然语言描述您想要的编辑。AI能理解复杂的指令，如"将生物放在雪山中"或"想象整个面部并创建它"。它处理您的文字提示并生成完美编辑的图片。',
  },
  {
    question: "与其他编辑器相比有什么优势？",
    answer:
      '这个模型在角色一致性、场景融合和一键编辑方面表现出色。用户报告它在保留面部特征和将编辑无缝集成到背景方面"完全超越"其他编辑器。它还支持多图上下文，非常适合创建一致的AI虚拟形象。',
  },
  {
    question: "我可以用于商业项目吗？",
    answer:
      "可以！它非常适合创建AI UGC内容、社交媒体活动和营销材料。许多用户利用它来创建一致的AI虚拟形象和产品摄影。高质量的输出适合专业使用。",
  },
  {
    question: "它可以处理哪些类型的编辑？",
    answer:
      '编辑器可以处理复杂的编辑，包括面部完成、背景更改、对象放置、风格转换和角色修改。它擅长理解上下文指令，如"放在暴风雪中"或"创建整个面部"，同时保持逼真的质量。',
  },
  {
    question: "在哪里可以尝试智能香蕉？",
    answer:
      "您可以通过我们的网页界面尝试智能香蕉。只需上传您的图片，输入描述您想要编辑的文字提示，然后观看智能香蕉AI以令人难以置信的准确性和一致性转换您的照片。",
  },
]

export function FAQSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">常见问题</h2>
          <p className="text-xl text-muted-foreground text-balance">关于智能香蕉的常见问题解答</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12 p-8 bg-muted/50 rounded-lg">
          <p className="text-lg mb-2">还有其他问题？</p>
          <p className="text-muted-foreground">
            欢迎通过{" "}
            <a href="mailto:libo86874@gmail.com" className="text-primary hover:underline">
              libo86874@gmail.com
            </a>{" "}
            联系我们
          </p>
        </div>
      </div>
    </section>
  )
}
