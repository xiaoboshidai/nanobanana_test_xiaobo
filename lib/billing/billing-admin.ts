import { createAdminClient } from "@/lib/supabase/admin"
import type { BillingState } from "@/lib/billing/billing-types"

export async function getBillingStateByUserId(userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("billing_state")
    .select("user_id, creem_customer_id, creem_subscription_id, creem_subscription_status, creem_product_id, updated_at")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) throw error
  return (data as BillingState | null) ?? null
}

export async function upsertBillingState(input: {
  userId: string
  creemCustomerId?: string | null
  creemSubscriptionId?: string | null
  creemSubscriptionStatus?: string | null
  creemProductId?: string | null
}) {
  const supabase = createAdminClient()

  const row = {
    user_id: input.userId,
    creem_customer_id: input.creemCustomerId ?? null,
    creem_subscription_id: input.creemSubscriptionId ?? null,
    creem_subscription_status: input.creemSubscriptionStatus ?? null,
    creem_product_id: input.creemProductId ?? null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("billing_state").upsert(row, { onConflict: "user_id" })
  if (error) throw error
}

