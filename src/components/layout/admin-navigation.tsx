"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function AdminNavigation() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2 p-4 border-b bg-background">
    </nav>
  )
}
