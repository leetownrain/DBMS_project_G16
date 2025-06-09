"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DoorOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"

export function MainNav() {
  const pathname = usePathname()
  const { userRole } = useAuth()

  // 修改導航項目，只保留教室列表、時段查詢和教室查詢
  const publicNavItems = [
    {
      title: "首頁",
      href: "/",
    },
    {
      title: "教室列表",
      href: "/classrooms-public",
    },
    {
      title: "時段查詢",
      href: "/timetable",
    },
    {
      title: "教室查詢",
      href: "/classroom-schedule",
    },
  ]

  // 移除用戶導航項，這些將移至儀表板
  const userNavItems = []

  // 移除管理員導航項，這些將移至儀表板
  const adminNavItems = []

  // 只顯示公共導航項
  const navItems = [...publicNavItems]

  return (
    <div className="flex items-center">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold mr-6">
        <DoorOpen className="w-6 h-6" />
        <span className="hidden md:inline">教室管理系統</span>
      </Link>
      <nav className="hidden md:flex items-center space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="md:hidden">
        <Button variant="ghost" size="sm">
          <span className="sr-only">開啟選單</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
