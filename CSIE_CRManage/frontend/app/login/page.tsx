"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("請輸入電子郵件和密碼")
      return
    }

    const success = await login(email, password)
    if (success) {
      router.push("/")
    } else {
      setError("電子郵件或密碼無效")
    }
  }

  return (
    <>
      <SiteHeader />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px-88px)] bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">登入</CardTitle>
            <CardDescription>輸入您的憑證以訪問教室預約系統</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com 或 user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密碼</Label>
                  <Button variant="link" className="p-0 h-auto text-xs" type="button">
                    忘記密碼？
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="演示中任何密碼都可以"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登入中...
                </>
              ) : (
                "登入"
              )}
            </Button>
          </CardFooter>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg border-t text-sm text-center">
            <p className="text-muted-foreground">演示用途，請使用：</p>
            <p className="text-xs text-muted-foreground mt-1">
              管理員: <code>admin@example.com</code> (任何密碼)
              <br />
              用戶: <code>user@example.com</code> (任何密碼)
            </p>
          </div>
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
