"use client"

import { useRef, useState } from "react"
import { Crop, Download, Move, MousePointer2, Pencil, RotateCw, Scan, Sparkles, Trash2, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import type { EditorCanvasHandle, FiltersState, Tool, Upload } from "@/components/editor/editor-canvas"
import { EditorCanvas } from "@/components/editor/editor-canvas"

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

async function dataUrlToFile(dataUrl: string, name: string) {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  return new File([blob], name, { type: blob.type || "image/png" })
}

export function ImageEditor() {
  const canvasRef = useRef<EditorCanvasHandle>(null)

  const [upload, setUpload] = useState<Upload | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const [tool, setTool] = useState<Tool>("select")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [brushColor, setBrushColor] = useState("#ff2d55")
  const [brushSize, setBrushSize] = useState(10)
  const [mosaicPixelSize, setMosaicPixelSize] = useState(14)

  const [textDraft, setTextDraft] = useState("你好，世界")
  const [textColor, setTextColor] = useState("#ffffff")
  const [textSize, setTextSize] = useState(48)

  const [filters, setFilters] = useState<FiltersState>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    blur: 0,
    enhance: 0,
    grayscale: false,
  })

  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [flipX, setFlipX] = useState(false)
  const [flipY, setFlipY] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg" | "webp">("png")
  const [downloadQuality, setDownloadQuality] = useState(0.92)

  const replaceWithDataUrl = async (dataUrl: string) => {
    const file = await dataUrlToFile(dataUrl, "edited.png")
    setUpload({ dataUrl, file })
  }

  const resetView = () => {
    setZoom(1)
    setRotation(0)
    setFlipX(false)
    setFlipY(false)
    setPan({ x: 0, y: 0 })
  }

  const rotate90 = () => setRotation((r) => (r + 90) % 360)

  const download = async () => {
    const mimeType =
      downloadFormat === "png" ? "image/png" : downloadFormat === "webp" ? "image/webp" : "image/jpeg"
    const quality = downloadFormat === "png" ? undefined : clamp(downloadQuality, 0.1, 1)
    const dataUrl = canvasRef.current?.exportImageDataUrl(mimeType, quality)
    if (!dataUrl) return
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = `image-${Date.now()}.${downloadFormat}`
    a.click()
  }

  const applyCrop = async () => {
    const dataUrl = canvasRef.current?.applyCrop()
    if (!dataUrl) return
    await replaceWithDataUrl(dataUrl)
    setTool("select")
  }

  const generateByAI = async () => {
    if (!upload) return
    const trimmed = prompt.trim()
    if (!trimmed) return

    const dataUrl = canvasRef.current?.exportImageDataUrl("image/png")
    if (!dataUrl) return

    setIsGenerating(true)
    try {
      const imageFile = await dataUrlToFile(dataUrl, "input.png")
      const form = new FormData()
      form.set("prompt", trimmed)
      form.set("image", imageFile)

      const res = await fetch("/api/image/edit", { method: "POST", body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "AI 生成失败")

      const b64 = json?.b64
      const mime = json?.mime || "image/png"
      if (typeof b64 !== "string" || !b64) throw new Error("AI 未返回图片数据")

      await replaceWithDataUrl(`data:${mime};base64,${b64}`)
      setPrompt("")
    } catch (e: any) {
      window.alert(typeof e?.message === "string" ? e.message : "AI 生成失败")
    } finally {
      setIsGenerating(false)
    }
  }

  const addText = () => {
    if (!upload) return
    canvasRef.current?.addText({ text: textDraft || "文字", fill: textColor, fontSize: textSize })
    setTool("select")
  }

  const addSticker = (emoji: string) => {
    if (!upload) return
    canvasRef.current?.addSticker(emoji)
    setTool("select")
  }

  const deleteSelected = () => canvasRef.current?.deleteSelected()

  const currentToolLabel =
    tool === "select"
      ? "选择"
      : tool === "move"
        ? "移动/缩放（拖动画布）"
        : tool === "draw"
          ? "涂鸦"
          : tool === "mosaic"
            ? "马赛克（拖拽框选）"
            : "裁剪"

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Wand2 className="w-5 h-5 text-primary" />
          AI 指令编辑 + 本地工具
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload">上传图片</Label>
            <ImageUpload onImageUpload={setUpload} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">编辑指令（AI）</Label>
            <Textarea
              id="prompt"
              placeholder="例如：把背景换成雪山；让人物穿上红色外套；添加日落氛围光…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            className="w-full gap-2"
            size="lg"
            disabled={!upload || !prompt.trim() || isGenerating}
            onClick={generateByAI}
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? "生成中…" : "立即生成（覆盖预览）"}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant={tool === "select" ? "default" : "outline"} className="gap-2" onClick={() => setTool("select")}>
              <MousePointer2 className="w-4 h-4" />
              选择
            </Button>
            <Button variant={tool === "move" ? "default" : "outline"} className="gap-2" onClick={() => setTool("move")}>
              <Move className="w-4 h-4" />
              移动/缩放
            </Button>
            <Button variant={tool === "draw" ? "default" : "outline"} className="gap-2" onClick={() => setTool("draw")}>
              <Pencil className="w-4 h-4" />
              涂鸦
            </Button>
            <Button variant={tool === "mosaic" ? "default" : "outline"} className="gap-2" onClick={() => setTool("mosaic")}>
              <Scan className="w-4 h-4" />
              马赛克（框选）
            </Button>
            <Button
              variant={tool === "crop" ? "default" : "outline"}
              className="gap-2"
              onClick={() => {
                setTool("crop")
                canvasRef.current?.ensureCropRect()
              }}
              disabled={!upload}
            >
              <Crop className="w-4 h-4" />
              裁剪
            </Button>
            <Button variant="outline" className="gap-2" onClick={rotate90} disabled={!upload}>
              <RotateCw className="w-4 h-4" />
              旋转 90°
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setFlipX((v) => !v)} disabled={!upload}>
              水平翻转
            </Button>
            <Button variant="outline" onClick={() => setFlipY((v) => !v)} disabled={!upload}>
              垂直翻转
            </Button>
          </div>

          <div className="space-y-2">
            <Label>缩放</Label>
            <Slider value={[zoom]} min={0.25} max={3} step={0.01} onValueChange={(v) => setZoom(v[0] ?? 1)} disabled={!upload} />
          </div>

          <div className="space-y-2">
            <Label>涂鸦颜色 / 粗细</Label>
            <div className="flex items-center gap-3">
              <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} disabled={!upload} className="h-10 w-12 bg-transparent" />
              <Slider value={[brushSize]} min={1} max={60} step={1} onValueChange={(v) => setBrushSize(v[0] ?? 10)} disabled={!upload} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>马赛克像素大小</Label>
            <Slider value={[mosaicPixelSize]} min={4} max={48} step={1} onValueChange={(v) => setMosaicPixelSize(v[0] ?? 14)} disabled={!upload} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>滤镜</Label>
              <Button variant="outline" size="sm" onClick={() => setFilters((f) => ({ ...f, grayscale: !f.grayscale }))} disabled={!upload}>
                {filters.grayscale ? "取消黑白" : "黑白"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">亮度</Label>
              <Slider value={[filters.brightness]} min={-1} max={1} step={0.01} onValueChange={(v) => setFilters((f) => ({ ...f, brightness: v[0] ?? 0 }))} disabled={!upload} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">对比度</Label>
              <Slider value={[filters.contrast]} min={-100} max={100} step={1} onValueChange={(v) => setFilters((f) => ({ ...f, contrast: v[0] ?? 0 }))} disabled={!upload} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">饱和度</Label>
              <Slider value={[filters.saturation]} min={-1} max={1} step={0.01} onValueChange={(v) => setFilters((f) => ({ ...f, saturation: v[0] ?? 0 }))} disabled={!upload} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">色相</Label>
              <Slider value={[filters.hue]} min={-180} max={180} step={1} onValueChange={(v) => setFilters((f) => ({ ...f, hue: v[0] ?? 0 }))} disabled={!upload} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">模糊</Label>
              <Slider value={[filters.blur]} min={0} max={30} step={1} onValueChange={(v) => setFilters((f) => ({ ...f, blur: v[0] ?? 0 }))} disabled={!upload} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">锐化（增强）</Label>
              <Slider value={[filters.enhance]} min={0} max={1} step={0.01} onValueChange={(v) => setFilters((f) => ({ ...f, enhance: v[0] ?? 0 }))} disabled={!upload} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>文字</Label>
            <div className="flex items-center gap-2">
              <input className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm" value={textDraft} onChange={(e) => setTextDraft(e.target.value)} placeholder="输入文字…" disabled={!upload} />
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} disabled={!upload} className="h-10 w-12" />
            </div>
            <Slider value={[textSize]} min={12} max={160} step={1} onValueChange={(v) => setTextSize(v[0] ?? 48)} disabled={!upload} />
            <Button variant="outline" className="w-full" onClick={addText} disabled={!upload}>
              添加文字
            </Button>
          </div>

          <div className="space-y-2">
            <Label>贴纸</Label>
            <div className="flex flex-wrap gap-2">
              {["🍌", "⭐", "❤️", "🔥", "😎", "✨", "✅", "🎉"].map((e) => (
                <Button key={e} variant="outline" size="sm" onClick={() => addSticker(e)} disabled={!upload}>
                  {e}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="gap-2" onClick={download} disabled={!upload}>
              <Download className="w-4 h-4" />
              下载
            </Button>
            <Button variant="outline" onClick={resetView} disabled={!upload}>
              重置视图
            </Button>
          </div>

          <div className="space-y-2">
            <Label>导出格式 / 质量</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["png", "jpeg", "webp"] as const).map((f) => (
                <Button key={f} variant={downloadFormat === f ? "default" : "outline"} size="sm" onClick={() => setDownloadFormat(f)} disabled={!upload}>
                  {f.toUpperCase()}
                </Button>
              ))}
            </div>
            <Slider value={[downloadQuality]} min={0.1} max={1} step={0.01} onValueChange={(v) => setDownloadQuality(v[0] ?? 0.92)} disabled={!upload || downloadFormat === "png"} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="destructive" className="gap-2" onClick={deleteSelected} disabled={!selectedId}>
              <Trash2 className="w-4 h-4" />
              删除选中
            </Button>
            {tool === "crop" ? (
              <Button className="gap-2" onClick={applyCrop} disabled={!upload}>
                应用裁剪（覆盖）
              </Button>
            ) : (
              <div />
            )}
          </div>

          <p className="text-xs text-muted-foreground">提示：本地操作在浏览器完成；点击“立即生成”会把当前预览图发送到服务端调用 AI 编辑并覆盖预览。</p>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="w-5 h-5 text-primary" />
          预览结果（覆盖式）
        </div>

        <div className="w-full h-[520px] bg-muted rounded-lg overflow-hidden">
          <EditorCanvas
            ref={canvasRef}
            upload={upload}
            tool={tool}
            brushColor={brushColor}
            brushSize={brushSize}
            mosaicPixelSize={mosaicPixelSize}
            filters={filters}
            zoom={zoom}
            rotation={rotation}
            flipX={flipX}
            flipY={flipY}
            pan={pan}
            onPanChange={setPan}
            onSelectedIdChange={setSelectedId}
          />
        </div>

        <div className="text-xs text-muted-foreground">当前工具：{currentToolLabel}</div>
      </Card>
    </div>
  )
}
