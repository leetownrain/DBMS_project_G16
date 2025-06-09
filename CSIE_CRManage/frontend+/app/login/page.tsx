"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useAuth } from "@/components/auth/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/dashboard"
  const { login } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // 模擬登入請求
      // 在實際應用中，這裡應該是向後端API發送請求
      if (email === "admin@example.com" && password === "password") {
        // 管理員登入
        login("admin", "管理員")
        router.push(redirectPath)
      } else if (email === "user@example.com" && password === "password") {
        // 一般用戶登入
        login("user", "王小明")
        router.push(redirectPath)
      } else {
        // 登入失敗
        setError("電子郵件或密碼錯誤")
      }
    } catch (err) {
      setError("登入時發生錯誤，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="flex items-center justify-center flex-1 px-4 py-12">
          <div className="w-full max-w-md space-y-6">
            <div className="flex flex-col items-center space-y-2 text-center">
              <h1 className="text-3xl font-bold">登入</h1>
              <p className="text-sm text-gray-500">輸入您的帳號密碼登入系統</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密碼</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    忘記密碼?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "登入中..." : "登入"}
                </Button>
              </div>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                還沒有帳號?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  註冊
                </Link>
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-center text-muted-foreground mb-2">測試帳號</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <p>
                    <strong>管理員帳號:</strong> admin@example.com
                  </p>
                  <p>
                    <strong>密碼:</strong> password
                  </p>
                </div>
                <div>
                  <p>
                    <strong>一般用戶帳號:</strong> user@example.com
                  </p>
                  <p>
                    <strong>密碼:</strong> password
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
