"use client"

import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/contexts/admin-context"

export function AccessRequestsTab() {
  const { upgradeRequests, approveUpgradeRequest, rejectUpgradeRequest } = useAdmin()
  const pendingRequests = upgradeRequests.filter((r) => r.status === "pending")

  return (
    <>
      {pendingRequests.length > 0 ? (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="border rounded-md p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {request.userName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{request.email}</p>
                  <p className="text-sm mt-2">{request.reason}</p>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rejectUpgradeRequest(request.id)}
                    className="text-destructive"
                  >
                    拒絕
                  </Button>
                  <Button size="sm" onClick={() => approveUpgradeRequest(request.id)}>
                    批准
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">沒有待處理的權限請求</p>
        </div>
      )}
    </>
  )
}
