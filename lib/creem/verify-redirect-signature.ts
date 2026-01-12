import { createHash, timingSafeEqual } from "crypto"

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex")
}

export function verifyCreemRedirectSignature(params: URLSearchParams) {
  const signature = params.get("signature")
  if (!signature) return { ok: false as const, reason: "missing_signature" as const }

  const apiKey = process.env.CREEM_API_KEY
  if (typeof apiKey !== "string" || !apiKey) {
    return { ok: false as const, reason: "missing_api_key" as const }
  }

  const parts = Array.from(params.entries())
    .filter(([key]) => key !== "signature")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)

  parts.push(`salt=${apiKey}`)
  const expected = sha256Hex(parts.join("|"))

  const signatureBuffer = Buffer.from(signature, "utf8")
  const expectedBuffer = Buffer.from(expected, "utf8")
  if (signatureBuffer.length !== expectedBuffer.length) {
    return { ok: false as const, reason: "mismatch" as const, expected }
  }

  const ok = timingSafeEqual(signatureBuffer, expectedBuffer)
  return { ok: ok as boolean, reason: ok ? null : ("mismatch" as const), expected }
}
