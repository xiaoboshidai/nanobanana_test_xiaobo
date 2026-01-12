import { Checkout } from "@creem_io/nextjs"
import { NextRequest } from "next/server"

import { isCreemTestMode, requireCreemApiKey } from "@/lib/creem/server-config"

export const runtime = "nodejs"

function getCheckout() {
  return Checkout({
    apiKey: requireCreemApiKey(),
    testMode: isCreemTestMode(),
    defaultSuccessUrl: "/success",
  })
}

export async function GET(request: NextRequest) {
  return getCheckout()(request)
}
