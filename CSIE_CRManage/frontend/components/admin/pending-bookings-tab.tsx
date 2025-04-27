"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdmin } from "@/contexts/admin-context"

export function PendingBookingsTab() {
  const { pendingBookings, approveBooking, rejectBooking } = useAdmin()
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedBooking((prev) => (prev === id ? null : id))
  }

  return (
    <>
      {pendingBookings.length > 0 ? (
        <div className="space-y-3">
          {pendingBookings.map((booking) => (
            <div key={booking.id} className="border rounded-md overflow-hidden">
              <div
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => toggleExpand(booking.id)}
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{booking.id}</Badge>
                  <h3 className="font-medium">{booking.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-sm text-muted-foreground">
                    {booking.date} | {booking.start}-{booking.end}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      rejectBooking(booking.id)
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
                      approveBooking(booking.id)
                    }}
                    className="text-primary"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    批准
                  </Button>
                  {expandedBooking === booking.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {expandedBooking === booking.id && (
                <div className="p-3 bg-muted/25 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">預約詳情</h4>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">教室:</span> {booking.room}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">日期:</span> {booking.date}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">時間:</span> {booking.start} - {booking.end}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">請求者</h4>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">姓名:</span> {booking.requester.name}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">電子郵件:</span> {booking.requester.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="destructive" size="sm" onClick={() => rejectBooking(booking.id)}>
                      拒絕預約
                    </Button>
                    <Button size="sm" onClick={() => approveBooking(booking.id)}>
                      批准預約
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">沒有待批准的預約</p>
        </div>
      )}
    </>
  )
}
