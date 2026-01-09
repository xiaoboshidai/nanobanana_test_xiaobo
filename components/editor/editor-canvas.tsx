"use client"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import Konva from "konva"
import type { KonvaEventObject } from "konva/lib/Node"
import { Group, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from "react-konva"

export type Upload = { dataUrl: string; file: File }

export type Tool = "select" | "move" | "draw" | "mosaic" | "crop"

export type FiltersState = {
  brightness: number // -1..1
  contrast: number // -100..100
  saturation: number // -1..1
  hue: number // -180..180
  blur: number // 0..30
  enhance: number // 0..1
  grayscale: boolean
}

type TextNode = {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fill: string
  rotation: number
}

type LineNode = {
  id: string
  points: number[]
  stroke: string
  strokeWidth: number
}

type RectNode = {
  id: string
  x: number
  y: number
  width: number
  height: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

export type EditorCanvasHandle = {
  exportImageDataUrl: (mimeType: string, quality?: number) => string | null
  ensureCropRect: () => void
  applyCrop: () => string | null
  addText: (t: { text: string; fill: string; fontSize: number }) => void
  addSticker: (emoji: string) => void
  deleteSelected: () => void
}

type Props = {
  upload: Upload | null
  tool: Tool
  brushColor: string
  brushSize: number
  mosaicPixelSize: number
  filters: FiltersState
  zoom: number
  rotation: number
  flipX: boolean
  flipY: boolean
  pan: { x: number; y: number }
  onPanChange: (p: { x: number; y: number }) => void
  onSelectedIdChange?: (id: string | null) => void
}

export const EditorCanvas = forwardRef<EditorCanvasHandle, Props>(function EditorCanvas(
  {
    upload,
    tool,
    brushColor,
    brushSize,
    mosaicPixelSize,
    filters,
    zoom,
    rotation,
    flipX,
    flipY,
    pan,
    onPanChange,
    onSelectedIdChange,
  },
  ref,
) {
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null)
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null)

  const [stageSize, setStageSize] = useState({ w: 1, h: 1 })
  const [fitScale, setFitScale] = useState(1)

  const stageRef = useRef<Konva.Stage>(null)
  const layerRef = useRef<Konva.Layer>(null)
  const groupRef = useRef<Konva.Group>(null)
  const imageRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const cropTransformerRef = useRef<Konva.Transformer>(null)
  const cropRectRef = useRef<Konva.Rect>(null)
  const mosaicImageRefs = useRef<Record<string, Konva.Image>>({})

  const containerRef = useRef<HTMLDivElement>(null)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [texts, setTexts] = useState<TextNode[]>([])
  const [stickers, setStickers] = useState<TextNode[]>([])
  const [lines, setLines] = useState<LineNode[]>([])
  const [mosaics, setMosaics] = useState<RectNode[]>([])
  const [cropRect, setCropRect] = useState<RectNode | null>(null)

  const isPointerDownRef = useRef(false)
  const rectStartRef = useRef<{ x: number; y: number } | null>(null)

  const scaleAbs = useMemo(() => Math.abs(fitScale * zoom), [fitScale, zoom])

  const baseFilters = useMemo(() => {
    const f: Array<(imageData: ImageData) => void> = []
    if (filters.grayscale) f.push(Konva.Filters.Grayscale)
    if (filters.brightness !== 0) f.push(Konva.Filters.Brighten)
    if (filters.contrast !== 0) f.push(Konva.Filters.Contrast)
    if (filters.saturation !== 0 || filters.hue !== 0) f.push(Konva.Filters.HSL)
    if (filters.blur !== 0) f.push(Konva.Filters.Blur)
    if (filters.enhance !== 0) f.push(Konva.Filters.Enhance)
    return f
  }, [filters])

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (!rect) return
      setStageSize({
        w: Math.max(1, Math.floor(rect.width)),
        h: Math.max(1, Math.floor(rect.height)),
      })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!upload?.dataUrl) {
      setImageEl(null)
      setImageSize(null)
      return
    }
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImageEl(img)
      setImageSize({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height })
    }
    img.src = upload.dataUrl
  }, [upload?.dataUrl])

  useEffect(() => {
    if (!imageSize) return
    const s = Math.min(stageSize.w / imageSize.w, stageSize.h / imageSize.h)
    setFitScale(Number.isFinite(s) && s > 0 ? s : 1)
  }, [imageSize, stageSize])

  useEffect(() => {
    // 覆盖预览：图片变更时清空叠加层
    setSelectedId(null)
    onSelectedIdChange?.(null)
    setTexts([])
    setStickers([])
    setLines([])
    setMosaics([])
    setCropRect(null)
  }, [upload?.dataUrl])

  useEffect(() => {
    const t = transformerRef.current
    const stage = stageRef.current
    if (!t || !stage) return
    if (!selectedId) {
      t.nodes([])
      t.getLayer()?.batchDraw()
      return
    }
    const node = stage.findOne(`#${selectedId}`)
    if (!node) {
      t.nodes([])
      t.getLayer()?.batchDraw()
      return
    }
    t.nodes([node])
    t.getLayer()?.batchDraw()
  }, [selectedId])

  useEffect(() => {
    if (tool !== "crop") return
    if (!cropRect || !cropTransformerRef.current || !stageRef.current) return
    const node = stageRef.current.findOne("#__crop_rect__")
    if (node) {
      cropTransformerRef.current.nodes([node])
      cropTransformerRef.current.getLayer()?.batchDraw()
    }
  }, [tool, cropRect])

  useEffect(() => {
    const base = imageRef.current
    if (base) {
      base.cache()
      base.getLayer()?.batchDraw()
    }
    for (const node of Object.values(mosaicImageRefs.current)) node.cache()
    layerRef.current?.batchDraw()
  }, [baseFilters, filters, mosaics, mosaicPixelSize, imageEl])

  const groupTransform = useMemo(() => {
    const sx = fitScale * zoom * (flipX ? -1 : 1)
    const sy = fitScale * zoom * (flipY ? -1 : 1)
    return {
      x: stageSize.w / 2 + pan.x,
      y: stageSize.h / 2 + pan.y,
      rotation,
      scaleX: sx,
      scaleY: sy,
      offsetX: imageSize ? imageSize.w / 2 : 0,
      offsetY: imageSize ? imageSize.h / 2 : 0,
    }
  }, [fitScale, zoom, flipX, flipY, rotation, stageSize, pan, imageSize])

  const ensureCropRect = () => {
    if (!imageSize) return
    if (cropRect) return
    setCropRect({
      id: "__crop_rect__",
      x: imageSize.w * 0.1,
      y: imageSize.h * 0.1,
      width: imageSize.w * 0.8,
      height: imageSize.h * 0.8,
    })
  }

  const exportImageDataUrl = (mimeType: string, quality?: number) => {
    const stage = stageRef.current
    const imgNode = imageRef.current
    if (!stage || !imgNode || !imageSize) return null
    const rect = imgNode.getClientRect({ relativeTo: stage })
    const pixelRatio = scaleAbs > 0 ? 1 / scaleAbs : 1
    return stage.toDataURL({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      pixelRatio,
      mimeType,
      quality,
    })
  }

  const applyCrop = () => {
    const stage = stageRef.current
    const rectNode = cropRectRef.current
    if (!stage || !rectNode) return null
    const rect = rectNode.getClientRect({ relativeTo: stage })
    const pixelRatio = scaleAbs > 0 ? 1 / scaleAbs : 1
    const dataUrl = stage.toDataURL({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      pixelRatio,
      mimeType: "image/png",
    })
    setCropRect(null)
    return dataUrl
  }

  const addText = (t: { text: string; fill: string; fontSize: number }) => {
    if (!imageSize) return
    const next: TextNode = {
      id: uid("text"),
      text: t.text || "文字",
      x: imageSize.w / 2,
      y: imageSize.h / 2,
      fontSize: t.fontSize,
      fill: t.fill,
      rotation: 0,
    }
    setTexts((prev) => [...prev, next])
    setSelectedId(next.id)
    onSelectedIdChange?.(next.id)
  }

  const addSticker = (emoji: string) => {
    if (!imageSize) return
    const next: TextNode = {
      id: uid("sticker"),
      text: emoji,
      x: imageSize.w / 2,
      y: imageSize.h / 2,
      fontSize: 72,
      fill: "#ffffff",
      rotation: 0,
    }
    setStickers((prev) => [...prev, next])
    setSelectedId(next.id)
    onSelectedIdChange?.(next.id)
  }

  const deleteSelected = () => {
    if (!selectedId) return
    setTexts((prev) => prev.filter((t) => t.id !== selectedId))
    setStickers((prev) => prev.filter((t) => t.id !== selectedId))
    setSelectedId(null)
    onSelectedIdChange?.(null)
  }

  useImperativeHandle(
    ref,
    () => ({
      exportImageDataUrl,
      ensureCropRect,
      applyCrop,
      addText,
      addSticker,
      deleteSelected,
    }),
    [exportImageDataUrl, ensureCropRect, applyCrop, addText, addSticker, deleteSelected],
  )

  const clearSelection = () => {
    setSelectedId(null)
    onSelectedIdChange?.(null)
  }

  const handleStageMouseDown = () => {
    if (!stageRef.current || !groupRef.current || !imageSize) return
    const stage = stageRef.current
    const group = groupRef.current
    const pos = group.getRelativePointerPosition()
    if (!pos) return
    isPointerDownRef.current = true

    if (tool === "draw") {
      const next: LineNode = {
        id: uid("line"),
        points: [pos.x, pos.y],
        stroke: brushColor,
        strokeWidth: brushSize,
      }
      setLines((prev) => [...prev, next])
      clearSelection()
      return
    }

    if (tool === "mosaic") {
      rectStartRef.current = { x: pos.x, y: pos.y }
      const next: RectNode = { id: "__mosaic_draft__", x: pos.x, y: pos.y, width: 1, height: 1 }
      setMosaics((prev) => [...prev.filter((r) => r.id !== "__mosaic_draft__"), next])
      clearSelection()
      return
    }

    if (tool === "crop") {
      ensureCropRect()
      clearSelection()
      return
    }

    const clickedOnEmpty =
      stage.getIntersection(stage.getPointerPosition() || { x: 0, y: 0 }) == null
    if (clickedOnEmpty) clearSelection()
  }

  const handleStageMouseMove = () => {
    if (!isPointerDownRef.current) return
    if (!groupRef.current) return
    const group = groupRef.current
    const pos = group.getRelativePointerPosition()
    if (!pos) return

    if (tool === "draw") {
      setLines((prev) => {
        const last = prev[prev.length - 1]
        if (!last) return prev
        return prev.slice(0, -1).concat({ ...last, points: last.points.concat([pos.x, pos.y]) })
      })
      return
    }

    if (tool === "mosaic") {
      const start = rectStartRef.current
      if (!start) return
      const x = Math.min(start.x, pos.x)
      const y = Math.min(start.y, pos.y)
      const width = Math.abs(pos.x - start.x)
      const height = Math.abs(pos.y - start.y)
      setMosaics((prev) =>
        prev.map((r) => (r.id === "__mosaic_draft__" ? { ...r, x, y, width, height } : r)),
      )
    }
  }

  const handleStageMouseUp = () => {
    isPointerDownRef.current = false
    rectStartRef.current = null
    if (tool !== "mosaic") return
    setMosaics((prev) => {
      const draft = prev.find((r) => r.id === "__mosaic_draft__")
      if (!draft) return prev
      if (draft.width < 6 || draft.height < 6) return prev.filter((r) => r.id !== "__mosaic_draft__")
      const committed: RectNode = { ...draft, id: uid("mosaic") }
      return prev.filter((r) => r.id !== "__mosaic_draft__").concat(committed)
    })
  }

  const handleNodeClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "select") return
    const id = e.target?.id?.()
    if (typeof id === "string" && id) {
      setSelectedId(id)
      onSelectedIdChange?.(id)
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      {upload && imageEl && imageSize ? (
        <Stage
          ref={stageRef}
          width={stageSize.w}
          height={stageSize.h}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onTouchStart={handleStageMouseDown}
          onTouchMove={handleStageMouseMove}
          onTouchEnd={handleStageMouseUp}
        >
          <Layer ref={layerRef}>
            <Group
              ref={groupRef}
              {...groupTransform}
              draggable={tool === "move"}
              onDragEnd={(e) =>
                onPanChange({
                  x: e.target.x() - stageSize.w / 2,
                  y: e.target.y() - stageSize.h / 2,
                })
              }
            >
              <KonvaImage
                ref={imageRef}
                image={imageEl}
                width={imageSize.w}
                height={imageSize.h}
                listening={false}
                filters={baseFilters}
                brightness={filters.brightness}
                contrast={filters.contrast}
                saturation={filters.saturation}
                hue={filters.hue}
                blurRadius={filters.blur}
                enhance={filters.enhance}
              />

              {mosaics
                .filter((r) => r.id !== "__mosaic_draft__")
                .map((r) => (
                  <Group key={r.id} clipX={r.x} clipY={r.y} clipWidth={r.width} clipHeight={r.height}>
                    <KonvaImage
                      ref={(node) => {
                        if (node) mosaicImageRefs.current[r.id] = node
                        else delete mosaicImageRefs.current[r.id]
                      }}
                      image={imageEl}
                      width={imageSize.w}
                      height={imageSize.h}
                      listening={false}
                      filters={[...baseFilters, Konva.Filters.Pixelate]}
                      pixelSize={mosaicPixelSize}
                      brightness={filters.brightness}
                      contrast={filters.contrast}
                      saturation={filters.saturation}
                      hue={filters.hue}
                      blurRadius={filters.blur}
                      enhance={filters.enhance}
                    />
                  </Group>
                ))}

              {mosaics.map((r) => (
                <Rect
                  key={r.id}
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  stroke={r.id === "__mosaic_draft__" ? "#ffffff" : "#ff2d55"}
                  dash={[6, 6]}
                  strokeWidth={2}
                  listening={false}
                />
              ))}

              {lines.map((l) => (
                <Line
                  key={l.id}
                  points={l.points}
                  stroke={l.stroke}
                  strokeWidth={l.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  listening={false}
                />
              ))}

              {texts.map((t) => (
                <Text
                  key={t.id}
                  id={t.id}
                  x={t.x}
                  y={t.y}
                  text={t.text}
                  fontSize={t.fontSize}
                  fill={t.fill}
                  rotation={t.rotation}
                  draggable={tool === "select"}
                  onClick={handleNodeClick}
                  onTap={handleNodeClick}
                  onDragEnd={(e) => {
                    const { x, y } = e.target.position()
                    setTexts((prev) => prev.map((p) => (p.id === t.id ? { ...p, x, y } : p)))
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target
                    const sx = node.scaleX()
                    const nextFontSize = clamp(Math.round(t.fontSize * sx), 10, 400)
                    node.scaleX(1)
                    node.scaleY(1)
                    setTexts((prev) =>
                      prev.map((p) =>
                        p.id === t.id
                          ? { ...p, x: node.x(), y: node.y(), rotation: node.rotation(), fontSize: nextFontSize }
                          : p,
                      ),
                    )
                  }}
                />
              ))}

              {stickers.map((t) => (
                <Text
                  key={t.id}
                  id={t.id}
                  x={t.x}
                  y={t.y}
                  text={t.text}
                  fontSize={t.fontSize}
                  fill={t.fill}
                  rotation={t.rotation}
                  draggable={tool === "select"}
                  onClick={handleNodeClick}
                  onTap={handleNodeClick}
                  onDragEnd={(e) => {
                    const { x, y } = e.target.position()
                    setStickers((prev) => prev.map((p) => (p.id === t.id ? { ...p, x, y } : p)))
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target
                    const sx = node.scaleX()
                    const nextFontSize = clamp(Math.round(t.fontSize * sx), 16, 480)
                    node.scaleX(1)
                    node.scaleY(1)
                    setStickers((prev) =>
                      prev.map((p) =>
                        p.id === t.id
                          ? { ...p, x: node.x(), y: node.y(), rotation: node.rotation(), fontSize: nextFontSize }
                          : p,
                      ),
                    )
                  }}
                />
              ))}

              {tool === "crop" && cropRect ? (
                <Rect
                  ref={cropRectRef}
                  id="__crop_rect__"
                  x={cropRect.x}
                  y={cropRect.y}
                  width={cropRect.width}
                  height={cropRect.height}
                  fill="rgba(0,0,0,0.06)"
                  stroke="#ffffff"
                  dash={[8, 6]}
                  strokeWidth={2}
                  draggable
                  onDragEnd={(e) => setCropRect((r) => (r ? { ...r, x: e.target.x(), y: e.target.y() } : r))}
                  onTransformEnd={(e) => {
                    const node = e.target
                    const sx = node.scaleX()
                    const sy = node.scaleY()
                    node.scaleX(1)
                    node.scaleY(1)
                    setCropRect((r) =>
                      r
                        ? {
                            ...r,
                            x: node.x(),
                            y: node.y(),
                            width: Math.max(1, node.width() * sx),
                            height: Math.max(1, node.height() * sy),
                          }
                        : r,
                    )
                  }}
                />
              ) : null}
            </Group>

            <Transformer
              ref={transformerRef}
              rotateEnabled
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
            />

            {tool === "crop" ? (
              <Transformer
                ref={cropTransformerRef}
                rotateEnabled={false}
                enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 20 || newBox.height < 20) return oldBox
                  return newBox
                }}
              />
            ) : null}
          </Layer>
        </Stage>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-center p-10 text-muted-foreground">
          上传一张图片后开始编辑
        </div>
      )}
    </div>
  )
})

