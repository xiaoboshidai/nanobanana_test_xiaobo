"use client"

import type React from "react"
import { CreemPortal } from "@creem_io/nextjs"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CreemPortalLink({
  customerId,
  className,
  children,
}: {
  customerId: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <CreemPortal customerId={customerId} className={cn(buttonVariants({ variant: "outline" }), className)}>
      {children ?? "管理订阅"}
    </CreemPortal>
  )
}
