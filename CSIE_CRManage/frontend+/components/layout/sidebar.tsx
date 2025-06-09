"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, History, Settings, Users, BookOpen } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export function Sidebar() {
  const pathname = usePathname()
  const { userRole, isAuthenticated } = useAuth()

  // 如果用戶未登入，不顯示側邊欄
  if (!isAuthenticated) return null

  // 修改側邊欄項目，為一般用戶添加預約查詢和歷史紀錄
  const userNavItems = [
    {
      title: "儀表板",
      href: "/dashboard",
      icon: <CalendarDays className="w-5 h-5 mr-2" />,
    },
    {
      title: "預約查詢",
      href: "/bookings",
      icon: <Clock className="w-5 h-5 mr-2" />,
    },
    {
      title: "歷史紀錄",
      href: "/history",
      icon: <History className="w-5 h-5 mr-2" />,
    },
  ]

  // 修改管理員可以看到的側邊欄項目，添加課程管理
  const adminNavItems = [
    {
      title: "儀表板",
      href: "/dashboard",
      icon: <CalendarDays className="w-5 h-5 mr-2" />,
    },
    {
      title: "課程管理",
      href: "/admin/courses",
      icon: <BookOpen className="w-5 h-5 mr-2" />,
    },
    {
      title: "時段管理",
      href: "/admin/timeslots",
      icon: <Clock className="w-5 h-5 mr-2" />,
    },
    {
      title: "教室管理",
      href: "/admin/classrooms",
      icon: <Settings className="w-5 h-5 mr-2" />,
    },
    {
      title: "預約審核",
      href: "/admin/approvals",
      icon: <Users className="w-5 h-5 mr-2" />,
    },
  ]

  // 根據用戶角色決定顯示哪些側邊欄項目
  const navItems = userRole === "admin" ? adminNavItems : userNavItems

  return (
    <aside className="w-64 p-4 border-r bg-muted/40 hidden md:block">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
              {item.icon}
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
