"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 初始檢查
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // 首次運行
    checkIfMobile()

    // 監聽視窗大小變化
    window.addEventListener("resize", checkIfMobile)

    // 清理函數
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return isMobile
}
