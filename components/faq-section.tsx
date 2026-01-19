import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "什么是智能香蕉？",
    answer:
      "智能香蕉是一个基于 AI 的图片编辑工具，支持用自然语言提示对图片进行修改与生成。不同图片与提示词下效果会有差异，我们建议先在编辑器中小范围试用并逐步调整提示词。",
  },
  {
    question: "它是如何工作的？",
    answer:
      '只需上传一张图片并用自然语言描述你想要的编辑。AI 会根据提示词进行处理并生成结果；如需更接近预期，可以通过更明确的描述、约束条件与多次迭代来优化输出。',
  },
  {
    question: "与其他编辑器相比有什么优势？",
    answer:
      "我们提供一键编辑、场景替换、风格转换等常见能力，并尽量在同一素材与相似提示词下保持输出稳定性。你也可以通过多次迭代提示词来获得更符合预期的结果。",
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
            <a href="mailto:xiaobo@nanobananaxiaobotest.online" className="text-primary hover:underline">
              xiaobo@nanobananaxiaobotest.online
            </a>{" "}
            联系我们
          </p>
        </div>
      </div>
    </section>
  )
}
