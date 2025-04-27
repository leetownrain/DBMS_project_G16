"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 如果仍在加載則跳過
    if (isLoading) return

    // 如果沒有用戶且不在登錄頁面，則重定向到登錄
    if (!user && pathname !== "/login") {
      router.push("/login")
      return
    }

    // 如果需要管理員權限但用戶不是管理員，則重定向到首頁
    if (user && requireAdmin && user.role !== "admin") {
      router.push("/")
      return
    }
  }, [user, isLoading, router, pathname, requireAdmin])

  // 檢查認證時顯示加載狀態
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // 如果在登錄頁面且用戶已登錄，則不需要守衛
  if (pathname === "/login") {
    return <>{children}</>
  }

  // 如果沒有用戶，則不渲染子組件（重定向在useEffect中處理）
  if (!user) {
    return null
  }

  // 如果需要管理員權限但用戶不是管理員，則不渲染子組件
  if (requireAdmin && user.role !== "admin") {
    return null
  }

  return <>{children}</>
}
