import { Portal } from "@creem_io/nextjs"
import { NextRequest } from "next/server"

import { isCreemTestMode, requireCreemApiKey } from "@/lib/creem/server-config"

export const runtime = "nodejs"

function getPortal() {
  return Portal({
    apiKey: requireCreemApiKey(),
    testMode: isCreemTestMode(),
  })
}

export async function GET(request: NextRequest) {
  return getPortal()(request)
}
