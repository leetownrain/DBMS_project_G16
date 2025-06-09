"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DoorOpen } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // 模擬註冊請求
    setTimeout(() => {
      setIsLoading(false)
      router.push("/login")
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <DoorOpen className="w-6 h-6" />
            <span>教室管理系統</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">登入</Button>
            </Link>
            <Link href="/register">
              <Button>註冊</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="flex items-center justify-center flex-1 px-4 py-12">
          <div className="w-full max-w-md space-y-6">
            <div className="flex flex-col items-center space-y-2 text-center">
              <DoorOpen className="w-10 h-10" />
              <h1 className="text-3xl font-bold">註冊</h1>
              <p className="text-sm text-gray-500">創建一個新帳號以使用教室管理系統</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input id="name" type="text" placeholder="王小明" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input id="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密碼</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">確認密碼</Label>
                <Input id="confirm-password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "註冊中..." : "註冊"}
              </Button>
            </form>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                已有帳號?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  登入
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2 text-sm">
              <DoorOpen className="w-5 h-5" />
              <span>© 2025 教室管理系統</span>
            </div>
            <nav className="flex gap-4 text-sm">
              <Link href="#" className="transition-colors hover:text-primary">
                使用條款
              </Link>
              <Link href="#" className="transition-colors hover:text-primary">
                隱私政策
              </Link>
              <Link href="#" className="transition-colors hover:text-primary">
                聯絡我們
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
