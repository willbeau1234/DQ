"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, Eye, Trash2, Plus } from "lucide-react"
import { format } from "date-fns"

interface DataEntryHistoryProps {
  storeId: string
  onEditEntry?: (date: string) => void
}

export function DataEntryHistory({ storeId, onEditEntry }: DataEntryHistoryProps) {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntryHistory()
  }, [storeId])

  const fetchEntryHistory = async () => {
    try {
      // Mock data - in real app, fetch from database
      const mockEntries = [
        {
          id: 1,
          date: "2024-12-15",
          total_sales: 1247.5,
          transaction_count: 89,
          average_ticket: 14.02,
          labor_percentage: 28.5,
          food_percentage: 31.2,
          source: "manual",
          created_at: "2024-12-15T10:30:00Z",
        },
        {
          id: 2,
          date: "2024-12-14",
          total_sales: 1156.75,
          transaction_count: 76,
          average_ticket: 15.22,
          labor_percentage: 29.1,
          food_percentage: 32.8,
          source: "csv",
          created_at: "2024-12-14T09:15:00Z",
        },
        {
          id: 3,
          date: "2024-12-13",
          total_sales: 1389.25,
          transaction_count: 95,
          average_ticket: 14.62,
          labor_percentage: 27.8,
          food_percentage: 30.5,
          source: "manual",
          created_at: "2024-12-13T11:45:00Z",
        },
      ]

      setEntries(mockEntries)
    } catch (error) {
      console.error("Error fetching entry history:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "manual":
        return <Badge className="bg-blue-100 text-blue-800">Manual Entry</Badge>
      case "csv":
        return <Badge className="bg-green-100 text-green-800">CSV Upload</Badge>
      case "email":
        return <Badge className="bg-purple-100 text-purple-800">Email Import</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPerformanceColor = (percentage: number, isGoodWhenLow = true) => {
    const threshold = isGoodWhenLow ? 30 : 70
    if (isGoodWhenLow) {
      return percentage <= threshold
        ? "text-green-600"
        : percentage <= threshold + 5
          ? "text-yellow-600"
          : "text-red-600"
    } else {
      return percentage >= threshold
        ? "text-green-600"
        : percentage >= threshold - 5
          ? "text-yellow-600"
          : "text-red-600"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading entry history...</div>
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
              <Calendar className="h-5 w-5" />
              Data Entry History
            </CardTitle>
            <CardDescription>Recent daily data entries and their sources</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEditEntry?.(format(new Date(), "yyyy-MM-dd"))}>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No data entries found</p>
            <p className="text-sm">Start by adding your first daily data entry</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{format(new Date(entry.date), "EEEE, MMM dd, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">
                        Entered {format(new Date(entry.created_at), "MMM dd 'at' HH:mm")}
                      </p>
                    </div>
                    {getSourceBadge(entry.source)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEditEntry?.(entry.date)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Sales</p>
                    <p className="font-medium">${entry.total_sales.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Transactions</p>
                    <p className="font-medium">{entry.transaction_count}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Ticket</p>
                    <p className="font-medium">${entry.average_ticket.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Labor %</p>
                    <p className={`font-medium ${getPerformanceColor(entry.labor_percentage, true)}`}>
                      {entry.labor_percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
