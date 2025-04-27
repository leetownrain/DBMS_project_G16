"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useMobile } from "@/hooks/use-mobile"

export function UsersManagementTab() {
  const isMobile = useMobile()

  return (
    <>
      {isMobile ? (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="user-1">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="font-medium">管理員</div>
                <Badge>管理員</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">電子郵件</p>
                  <p>admin@example.com</p>
                </div>
                <div className="pt-2">
                  <Button variant="ghost" size="sm" disabled>
                    當前用戶
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="user-2">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="font-medium">一般使用者</div>
                <Badge variant="outline">用戶</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">電子郵件</p>
                  <p>user@example.com</p>
                </div>
                <div className="pt-2">
                  <Button variant="ghost" size="sm">
                    授予管理員權限
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="user-3">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="font-medium">張小明</div>
                <Badge variant="outline">用戶</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">電子郵件</p>
                  <p>john@example.com</p>
                </div>
                <div className="pt-2">
                  <Button variant="ghost" size="sm">
                    授予管理員權限
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div className="border rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-4 font-medium p-3 border-b">
            <div>用戶</div>
            <div>電子郵件</div>
            <div>角色</div>
            <div>操作</div>
          </div>

          <div className="divide-y">
            <div className="grid grid-cols-1 md:grid-cols-4 p-3 items-center">
              <div className="font-medium">管理員</div>
              <div className="text-sm">admin@example.com</div>
              <div>
                <Badge>管理員</Badge>
              </div>
              <div>
                <Button variant="ghost" size="sm" disabled>
                  當前用戶
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 p-3 items-center">
              <div className="font-medium">一般使用者</div>
              <div className="text-sm">user@example.com</div>
              <div>
                <Badge variant="outline">用戶</Badge>
              </div>
              <div>
                <Button variant="ghost" size="sm">
                  授予管理員權限
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 p-3 items-center">
              <div className="font-medium">張小明</div>
              <div className="text-sm">john@example.com</div>
              <div>
                <Badge variant="outline">用戶</Badge>
              </div>
              <div>
                <Button variant="ghost" size="sm">
                  授予管理員權限
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
