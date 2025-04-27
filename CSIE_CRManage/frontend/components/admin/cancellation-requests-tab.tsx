"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ChevronUp, ChevronDown, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdmin } from "@/contexts/admin-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useMobile } from "@/hooks/use-mobile"

export function CancellationRequestsTab() {
  const { cancellationRequests, approveCancellation, rejectCancellation } = useAdmin()
  const [expandedCancellation, setExpandedCancellation] = useState<number | null>(null)
  const [isRejectReasonOpen, setIsRejectReasonOpen] = useState(false)
  const [currentCancellation, setCurrentCancellation] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState("")
  const isMobile = useMobile()

  const pendingRequests = cancellationRequests.filter((r) => r.status === "pending")
  const processedRequests = cancellationRequests.filter((r) => r.status !== "pending")

  const toggleExpandCancellation = (id: number) => {
    setExpandedCancellation((prev) => (prev === id ? null : id))
  }

  const handleRejectCancellation = (id: number) => {
    setCurrentCancellation(cancellationRequests.find((req) => req.id === id))
    setRejectReason("")
    setIsRejectReasonOpen(true)
  }

  const handleConfirmRejectCancellation = () => {
    if (!currentCancellation || !rejectReason.trim()) return
    rejectCancellation(currentCancellation.id, rejectReason)
    setIsRejectReasonOpen(false)
    setCurrentCancellation(null)
  }

  return (
    <>
      {pendingRequests.length > 0 ? (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div key={request.id} className="border rounded-md overflow-hidden">
              <div
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => toggleExpandCancellation(request.id)}
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{request.bookingId}</Badge>
                  <h3 className="font-medium">{request.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-sm text-muted-foreground">
                    {request.date} | {request.time}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRejectCancellation(request.id)
                    }}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    拒絕
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      approveCancellation(request.id)
                    }}
                    className="text-primary"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    批准
                  </Button>
                  {expandedCancellation === request.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {expandedCancellation === request.id && (
                <div className="p-3 bg-muted/25 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">預約詳情</h4>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">教室:</span> {request.roomName} ({request.room})
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">日期:</span> {request.date}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">時間:</span> {request.time}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">取消原因:</span> {request.reason}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">申請時間:</span>{" "}
                          {format(new Date(request.requestedAt), "yyyy-MM-dd HH:mm")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">申請者</h4>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">姓名:</span> {request.userName}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">電子郵件:</span> {request.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="destructive" size="sm" onClick={() => handleRejectCancellation(request.id)}>
                      拒絕取消
                    </Button>
                    <Button size="sm" onClick={() => approveCancellation(request.id)}>
                      批准取消
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">沒有待處理的取消申請</p>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">已處理的取消申請</h3>
        {isMobile ? (
          <Accordion type="single" collapsible className="w-full">
            {processedRequests.map((request) => (
              <AccordionItem key={request.id} value={request.id.toString()}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="font-medium">{request.title}</div>
                    <div>
                      {request.status === "approved" ? (
                        <Badge className="bg-green-500">已批准</Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-500">
                          已拒絕
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">申請者</p>
                      <p>{request.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">教室</p>
                      <p>{request.roomName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">日期/時間</p>
                      <p>
                        {request.date}
                        <br />
                        {request.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">處理時間</p>
                      <p>{format(new Date(request.processedAt), "yyyy-MM-dd HH:mm")}</p>
                    </div>
                    {request.status === "rejected" && request.rejectReason && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">拒絕原因</p>
                        <p>{request.rejectReason}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-5 font-medium p-3 border-b">
              <div>預約</div>
              <div>教室</div>
              <div>日期/時間</div>
              <div>狀態</div>
              <div>處理時間</div>
            </div>

            <div className="divide-y">
              {processedRequests.map((request) => (
                <div key={request.id} className="grid grid-cols-1 md:grid-cols-5 p-3 items-center">
                  <div>
                    <div className="font-medium">{request.title}</div>
                    <div className="text-xs text-muted-foreground">{request.userName}</div>
                  </div>
                  <div className="text-sm">{request.roomName}</div>
                  <div className="text-sm">
                    {request.date}
                    <br />
                    {request.time}
                  </div>
                  <div>
                    {request.status === "approved" ? (
                      <Badge className="bg-green-500">已批准</Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-500">
                        已拒絕
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm">{format(new Date(request.processedAt), "yyyy-MM-dd HH:mm")}</div>
                </div>
              ))}

              {processedRequests.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">沒有已處理的取消申請</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 拒絕取消申請的原因對話框 */}
      <Dialog open={isRejectReasonOpen} onOpenChange={setIsRejectReasonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>拒絕取消申請</DialogTitle>
            <DialogDescription>請提供拒絕取消預約申請的原因。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reject-reason" className="text-right">
                拒絕原因
              </Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="請輸入拒絕取消申請的原因"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsRejectReasonOpen(false)}>
              取消
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmRejectCancellation}
              disabled={!rejectReason.trim()}
            >
              確認拒絕
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
