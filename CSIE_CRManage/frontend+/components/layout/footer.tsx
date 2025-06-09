import Link from "next/link"
import { DoorOpen } from "lucide-react"

export function Footer() {
  return (
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
  )
}
