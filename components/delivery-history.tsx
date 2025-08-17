"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { format } from "date-fns"

interface DeliveryHistoryProps {
  storeId: string
}

export function DeliveryHistory({ storeId }: DeliveryHistoryProps) {
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeliveryHistory()
  }, [storeId])

  const fetchDeliveryHistory = async () => {
    try {
      // Mock data - in real app, fetch from database
      const mockDeliveries = [
        {
          id: 1,
          report_date: "2024-12-15",
          delivery_method: "email",
          recipients: ["owner@dq.com", "manager@dq.com"],
          status: "sent",
          sent_at: "2024-12-15T08:00:00Z",
          report_role: "owner",
        },
        {
          id: 2,
          report_date: "2024-12-15",
          delivery_method: "email",
          recipients: ["manager@dq.com"],
          status: "sent",
          sent_at: "2024-12-15T08:05:00Z",
          report_role: "manager",
        },
        {
          id: 3,
          report_date: "2024-12-14",
          delivery_method: "email",
          recipients: ["team@dq.com"],
          status: "failed",
          sent_at: "2024-12-14T08:00:00Z",
          report_role: "employee",
          error: "Invalid email address",
        },
      ]

      setDeliveries(mockDeliveries)
    } catch (error) {
      console.error("Error fetching delivery history:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getMethodIcon = (method: string) => {
    return <Mail className="h-4 w-4" />
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading delivery history...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Delivery History
            </CardTitle>
            <CardDescription>Recent report delivery attempts and status</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchDeliveryHistory}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {deliveries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No delivery history found</p>
            <p className="text-sm">Reports will appear here once delivery is configured</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-2">
                    {getMethodIcon(delivery.delivery_method)}
                    <div>
                      <p className="font-medium text-sm">
                        {delivery.report_role.charAt(0).toUpperCase() + delivery.report_role.slice(1)} Report
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(delivery.report_date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(delivery.status)}
                    <span className="text-xs text-muted-foreground">{format(new Date(delivery.sent_at), "HH:mm")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {delivery.recipients.length} recipient{delivery.recipients.length !== 1 ? "s" : ""}
                  </p>
                  {delivery.error && <p className="text-xs text-red-600">{delivery.error}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
