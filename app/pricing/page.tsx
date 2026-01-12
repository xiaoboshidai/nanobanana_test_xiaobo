import { PricingSection } from "@/components/pricing/pricing-section"

export const metadata = {
  title: "定价 - 智能图片编辑器",
  description: "查看套餐与订阅价格。",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <PricingSection />
    </main>
  )
}

