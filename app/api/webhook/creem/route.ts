import { Webhook } from "@creem_io/nextjs"
import { NextRequest } from "next/server"

import { requireCreemWebhookSecret } from "@/lib/creem/server-config"

export const runtime = "nodejs"

function getWebhook() {
  return Webhook({
    webhookSecret: requireCreemWebhookSecret(),
    onCheckoutCompleted: async ({ webhookEventType, product, customer, subscription, order, metadata }) => {
      console.log("[creem] checkout completed", {
        webhookEventType,
        productId: product?.id,
        customerId: customer?.id,
        customerEmail: customer?.email,
        subscriptionId: subscription?.id,
        orderId: order?.id,
        metadata,
      })
    },
    onGrantAccess: async ({ reason, product, customer, id, metadata }) => {
      console.log("[creem] grant access", {
        reason,
        productId: product?.id,
        customerId: customer?.id,
        subscriptionId: id,
        metadata,
      })
    },
    onRevokeAccess: async ({ reason, product, customer, id, metadata }) => {
      console.log("[creem] revoke access", {
        reason,
        productId: product?.id,
        customerId: customer?.id,
        subscriptionId: id,
        metadata,
      })
    },
  })
}

export async function POST(request: NextRequest) {
  return getWebhook()(request)
}
