import { Webhook } from "@creem_io/nextjs"
import { NextRequest } from "next/server"

import { requireCreemWebhookSecret } from "@/lib/creem/server-config"
import { upsertBillingState } from "@/lib/billing/billing-admin"

export const runtime = "nodejs"

function getWebhook() {
  return Webhook({
    webhookSecret: requireCreemWebhookSecret(),
    onCheckoutCompleted: async ({ webhookEventType, product, customer, subscription, order, metadata }) => {
      const userId = typeof (metadata as any)?.referenceId === "string" ? ((metadata as any).referenceId as string) : null
      console.log("[creem] checkout completed", {
        webhookEventType,
        productId: product?.id,
        customerId: customer?.id,
        customerEmail: customer?.email,
        subscriptionId: subscription?.id,
        orderId: order?.id,
        metadata,
      })

      if (userId && customer?.id) {
        try {
          await upsertBillingState({
            userId,
            creemCustomerId: customer.id,
            creemSubscriptionId: subscription?.id ?? null,
            creemSubscriptionStatus: (subscription as any)?.status ?? null,
            creemProductId: product?.id ?? null,
          })
        } catch (err) {
          console.error("[creem] failed to upsert billing state (checkout.completed)", err)
        }
      }
    },
    onGrantAccess: async ({ reason, product, customer, id, status, metadata }) => {
      const userId = typeof (metadata as any)?.referenceId === "string" ? ((metadata as any).referenceId as string) : null
      console.log("[creem] grant access", {
        reason,
        productId: product?.id,
        customerId: customer?.id,
        subscriptionId: id,
        status,
        metadata,
      })

      if (userId && customer?.id) {
        try {
          await upsertBillingState({
            userId,
            creemCustomerId: customer.id,
            creemSubscriptionId: id ?? null,
            creemSubscriptionStatus: (status as any) ?? (reason as string),
            creemProductId: product?.id ?? null,
          })
        } catch (err) {
          console.error("[creem] failed to upsert billing state (grant access)", err)
        }
      }
    },
    onRevokeAccess: async ({ reason, product, customer, id, status, metadata }) => {
      const userId = typeof (metadata as any)?.referenceId === "string" ? ((metadata as any).referenceId as string) : null
      console.log("[creem] revoke access", {
        reason,
        productId: product?.id,
        customerId: customer?.id,
        subscriptionId: id,
        status,
        metadata,
      })

      if (userId && customer?.id) {
        try {
          await upsertBillingState({
            userId,
            creemCustomerId: customer.id,
            creemSubscriptionId: id ?? null,
            creemSubscriptionStatus: (status as any) ?? (reason as string),
            creemProductId: product?.id ?? null,
          })
        } catch (err) {
          console.error("[creem] failed to upsert billing state (revoke access)", err)
        }
      }
    },
  })
}

export async function POST(request: NextRequest) {
  return getWebhook()(request)
}
