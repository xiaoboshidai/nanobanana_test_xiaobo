"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onImageUpload: (upload: { dataUrl: string; file: File } | null) => void
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        window.alert("图片过大：请上传不超过 10MB 的图片。")
        if (fileInputRef.current) fileInputRef.current.value = ""
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        onImageUpload({ dataUrl: result, file })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageUpload(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />

      {preview ? (
        <div className="relative">
          <img src={preview || "/placeholder.svg"} alt="预览" className="w-full h-48 object-cover rounded-lg" />
          <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={handleRemove}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <Upload className="w-12 h-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">点击上传图片</p>
          <p className="text-xs text-muted-foreground mt-1">最大 10MB</p>
        </label>
      )}
    </div>
  )
}
