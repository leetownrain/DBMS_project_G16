"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"

interface RequireAuthProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function RequireAuth({ children, adminOnly = false }: RequireAuthProps) {
  const { userRole, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      return
    }

    if (adminOnly && userRole !== "admin") {
      router.push("/unauthorized")
      return
    }
  }, [isAuthenticated, userRole, adminOnly, router])

  if (!isAuthenticated || (adminOnly && userRole !== "admin")) {
    return null
  }

  return <>{children}</>
}
