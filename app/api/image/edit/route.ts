import OpenAI, { toFile } from "openai"

export const runtime = "nodejs"

type ErrorBody = { error: string }

function isOpenRouter(opts: { apiKey: string; baseURL?: string | undefined }) {
  return opts.apiKey.startsWith("sk-or-") || Boolean(opts.baseURL && opts.baseURL.includes("openrouter.ai"))
}

function normalizeOpenRouterModelId(model: string) {
  const trimmed = model.trim()
  if (!trimmed) return trimmed
  if (/^gemini\s*2\.5\s*flash\s*image$/i.test(trimmed)) return "google/gemini-2.5-flash-image"
  if (/^gemini-?2\.5-?flash-?image$/i.test(trimmed)) return "google/gemini-2.5-flash-image"
  return trimmed
}

function parseDataUrl(dataUrl: string) {
  const match = /^data:(?<mime>[^;]+);base64,(?<b64>.+)$/.exec(dataUrl)
  if (!match?.groups?.mime || !match?.groups?.b64) return null
  return { mime: match.groups.mime, b64: match.groups.b64 }
}

function pickImageUrlFromChatCompletion(completion: any) {
  const direct =
    completion?.choices?.[0]?.message?.images?.[0]?.image_url?.url ||
    completion?.choices?.[0]?.message?.images?.[0]?.imageUrl?.url
  if (typeof direct === "string" && direct) return direct

  const content = completion?.choices?.[0]?.message?.content
  if (Array.isArray(content)) {
    for (const part of content) {
      const url = part?.image_url?.url || part?.imageUrl?.url
      if (typeof url === "string" && url) return url
    }
  }

  return null
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) {
    return Response.json<ErrorBody>(
      { error: "缺少环境变量 OPENAI_API_KEY（或 OPENROUTER_API_KEY）（请在 .env.local 中配置）。" },
      { status: 500 },
    )
  }

  const envBaseURL = process.env.OPENROUTER_BASE_URL || process.env.OPENAI_BASE_URL
  const baseURL = envBaseURL || (apiKey.startsWith("sk-or-") ? "https://openrouter.ai/api/v1" : undefined)
  const useOpenRouter = isOpenRouter({ apiKey, baseURL })

  const configuredModelRaw = process.env.OPENAI_IMAGE_MODEL
  const configuredModel = typeof configuredModelRaw === "string" ? normalizeOpenRouterModelId(configuredModelRaw) : ""
  const defaultOpenRouterModel = "google/gemini-2.5-flash-image"
  const defaultOpenAIModel = "gpt-image-1.5"
  const model = (() => {
    if (useOpenRouter) {
      if (!configuredModel) return defaultOpenRouterModel
      // 防止用户没改模板里默认的 gpt-image-*，导致 OpenRouter 报 “not a valid model ID”
      if (!configuredModel.includes("/") && configuredModel.startsWith("gpt-image")) return defaultOpenRouterModel
      return configuredModel
    }
    return configuredModel || defaultOpenAIModel
  })()

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return Response.json<ErrorBody>({ error: "请求体不是有效的 multipart/form-data。" }, { status: 400 })
  }

  const prompt = formData.get("prompt")
  const image = formData.get("image")
  const size = formData.get("size")

  if (typeof prompt !== "string" || !prompt.trim()) {
    return Response.json<ErrorBody>({ error: "缺少 prompt。" }, { status: 400 })
  }
  if (!(image instanceof File)) {
    return Response.json<ErrorBody>({ error: "缺少 image 文件。" }, { status: 400 })
  }

  const openrouterSiteUrl = process.env.OPENROUTER_SITE_URL
  const openrouterSiteName = process.env.OPENROUTER_SITE_NAME

  const openai = new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
    ...(useOpenRouter
      ? {
          defaultHeaders: {
            ...(openrouterSiteUrl ? { "HTTP-Referer": openrouterSiteUrl } : {}),
            ...(openrouterSiteName ? { "X-Title": openrouterSiteName } : {}),
          },
        }
      : {}),
  })

  const imageBytes = Buffer.from(await image.arrayBuffer())
  const imageMime = image.type || "image/png"

  if (useOpenRouter) {
    const dataUrl = `data:${imageMime};base64,${imageBytes.toString("base64")}`

    try {
      const completion = await (openai.chat.completions.create as any)({
        model,
        // OpenRouter 图像模型通过 chat.completions + modalities 返回图片 data URL
        modalities: ["image", "text"],
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt.trim() },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      })

      const url = pickImageUrlFromChatCompletion(completion)
      if (!url) {
        return Response.json<ErrorBody>({ error: "模型未返回图片数据。" }, { status: 502 })
      }

      const parsed = parseDataUrl(url)
      if (!parsed) {
        return Response.json<ErrorBody>({ error: "模型返回的图片不是 data URL 格式。" }, { status: 502 })
      }

      return Response.json(parsed)
    } catch (err: any) {
      const rawMessage = typeof err?.message === "string" && err.message ? err.message : "调用 OpenRouter 图像模型失败。"
      const statusFromSdk =
        typeof err?.status === "number"
          ? err.status
          : typeof err?.response?.status === "number"
            ? err.response.status
            : undefined
      const statusFromMessage = (() => {
        const m = /^\s*(\d{3})\b/.exec(rawMessage)
        if (!m) return undefined
        const n = Number(m[1])
        return Number.isFinite(n) ? n : undefined
      })()
      const status = statusFromSdk || statusFromMessage || 502

      const help = (() => {
        if (status === 400 && /not a valid model id|invalid model/i.test(rawMessage)) {
          return `（提示：请把 OPENAI_IMAGE_MODEL 设为 "${defaultOpenRouterModel}"）`
        }
        if (status === 403 && /key limit exceeded/i.test(rawMessage)) {
          return "（提示：这是 OpenRouter Key 的额度/限额问题，需要到 `https://openrouter.ai/settings/keys` 调整 Key 的 limit 或更换/充值）"
        }
        return ""
      })()

      const message = help ? `${rawMessage} ${help}` : rawMessage
      return Response.json<ErrorBody>({ error: message }, { status: status >= 400 && status <= 599 ? status : 502 })
    }
  }

  const imageFile = await toFile(imageBytes, image.name || "input.png", {
    type: image.type || "image/png",
  })

  const doEdit = async (m: string) =>
    openai.images.edit({
      model: m,
      image: imageFile,
      prompt: prompt.trim(),
      ...(typeof size === "string" && size ? { size } : {}),
      response_format: "b64_json",
    })

  try {
    const result = await doEdit(model)

    const b64 = result.data?.[0]?.b64_json
    if (!b64) {
      return Response.json<ErrorBody>({ error: "模型未返回图片数据。" }, { status: 502 })
    }

    return Response.json({ b64, mime: "image/png" })
  } catch (err: any) {
    if (model === "gpt-image-1.5") {
      try {
        const fallback = await doEdit("gpt-image-1")
        const b64 = fallback.data?.[0]?.b64_json
        if (b64) return Response.json({ b64, mime: "image/png" })
      } catch {
        // ignore and fall through to main error
      }
    }
    const message = typeof err?.message === "string" && err.message ? err.message : "调用图片编辑模型失败。"
    return Response.json<ErrorBody>({ error: message }, { status: 502 })
  }
}
