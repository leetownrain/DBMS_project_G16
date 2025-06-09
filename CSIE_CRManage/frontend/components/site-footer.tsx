import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} 國立虎尾科技大學 資訊工程系 吳哲瑋 李鎮宇 陳亮祐 林致均 版權所有.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            使用條款
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            隱私政策
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            聯絡我們
          </Link>
        </div>
      </div>
    </footer>
  )
}
