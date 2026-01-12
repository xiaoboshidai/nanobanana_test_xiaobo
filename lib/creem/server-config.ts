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

export function isCreemTestMode() {
  return process.env.CREEM_TEST_MODE === "true"
}

