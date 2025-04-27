"use client"

import { useState } from "react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/contexts/auth-context"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export function SiteHeader() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            教室預約系統
          </Link>

          {isMobile ? (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">打開選單</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className="text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    首頁
                  </Link>
                  <Link
                    href="/book"
                    className="text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    預約教室
                  </Link>
                  {user && (
                    <Link
                      href="/my-reservations"
                      className="text-base font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      我的預約
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-base font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      管理員
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                首頁
              </Link>
              <Link href="/book" className="text-sm font-medium transition-colors hover:text-primary">
                預約教室
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                  管理員
                </Link>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
        </div>
      </div>
    </header>
  )
}
