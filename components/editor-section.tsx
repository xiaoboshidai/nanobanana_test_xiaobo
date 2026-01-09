"use client"

import { ImageEditor } from "@/components/editor/image-editor"

export function EditorSection() {
  return (
    <section id="editor" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">开始使用</h2>
          <p className="text-xl text-muted-foreground text-balance">
            上传图片，使用本地工具编辑，或输入一句话让 AI 直接修改并覆盖预览。
          </p>
        </div>

        <ImageEditor />
      </div>
    </section>
  )
}

