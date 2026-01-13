export function requireCreemApiKey() {
  const apiKey = process.env.CREEM_API_KEY
  if (typeof apiKey !== "string" || !apiKey) {
    throw new Error("未配置 Creem：请设置 CREEM_API_KEY。")
  }
  return apiKey
}

export function requireCreemWebhookSecret() {
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
  if (typeof webhookSecret !== "string" || !webhookSecret) {
    throw new Error("未配置 Creem：请设置 CREEM_WEBHOOK_SECRET。")
  }
  return webhookSecret
}

function parseBooleanEnv(value: string) {
  switch (value.trim().toLowerCase()) {
    case "1":
    case "true":
    case "yes":
    case "y":
    case "on":
      return true
    case "0":
    case "false":
    case "no":
    case "n":
    case "off":
      return false
    default:
      return null
  }
}

export function isCreemTestMode() {
  const raw = process.env.CREEM_TEST_MODE
  if (typeof raw === "string" && raw) {
    const parsed = parseBooleanEnv(raw)
    if (parsed !== null) return parsed
  }

  const apiKey = process.env.CREEM_API_KEY ?? ""
  const lower = apiKey.toLowerCase()
  if (lower.includes("test") || lower.includes("sandbox") || lower.startsWith("sk_test")) return true
  if (lower.includes("live") || lower.includes("prod") || lower.startsWith("sk_live")) return false

  return process.env.NODE_ENV !== "production"
}
