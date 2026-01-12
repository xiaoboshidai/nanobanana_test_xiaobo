export type BillingInterval = "month" | "year"
export type PlanKey = "starter" | "pro" | "team"

export const CREEM_PRODUCT_IDS = {
  starter: {
    month: process.env.NEXT_PUBLIC_CREEM_PRODUCT_STARTER_MONTHLY ?? "",
    year: process.env.NEXT_PUBLIC_CREEM_PRODUCT_STARTER_YEARLY ?? "",
  },
  pro: {
    month: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_MONTHLY ?? "",
    year: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_YEARLY ?? "",
  },
  team: {
    month: process.env.NEXT_PUBLIC_CREEM_PRODUCT_TEAM_MONTHLY ?? "",
    year: process.env.NEXT_PUBLIC_CREEM_PRODUCT_TEAM_YEARLY ?? "",
  },
} as const

export function getCreemProductId(plan: PlanKey, interval: BillingInterval) {
  const id = CREEM_PRODUCT_IDS[plan][interval]
  return typeof id === "string" && id ? id : null
}

