"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Search, Filter, Download, Eye, CalendarIcon, FileText } from "lucide-react"
import { format } from "date-fns"

interface ReportHistoryProps {
  storeId: string
}

export function ReportHistory({ storeId }: ReportHistoryProps) {
  const [reports, setReports] = useState<any[]>([])
  const [filteredReports, setFilteredReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedReport, setSelectedReport] = useState<any>(null)

  useEffect(() => {
    fetchReports()
  }, [storeId])

  useEffect(() => {
    filterReports()
  }, [reports, searchTerm, roleFilter, dateRange])

  const fetchReports = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockReports = [
        {
          id: 1,
          date: "2024-12-15",
          role: "owner",
          content: "Daily Owner Report for DQ Downtown...",
          generated_at: "2024-12-15T08:00:00Z",
          delivery_status: "sent",
        },
        {
          id: 2,
          date: "2024-12-15",
          role: "manager",
          content: "Daily Manager Report for DQ Downtown...",
          generated_at: "2024-12-15T08:05:00Z",
          delivery_status: "sent",
        },
        {
          id: 3,
          date: "2024-12-14",
          role: "owner",
          content: "Daily Owner Report for DQ Downtown...",
          generated_at: "2024-12-14T08:00:00Z",
          delivery_status: "failed",
        },
        {
          id: 4,
          date: "2024-12-14",
          role: "employee",
          content: "Daily Team Report for DQ Downtown...",
          generated_at: "2024-12-14T08:10:00Z",
          delivery_status: "sent",
        },
      ]

      setReports(mockReports)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterReports = () => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.role.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((report) => report.role === roleFilter)
    }

    if (dateRange.from) {
      filtered = filtered.filter((report) => new Date(report.date) >= dateRange.from!)
    }

    if (dateRange.to) {
      filtered = filtered.filter((report) => new Date(report.date) <= dateRange.to!)
    }

    setFilteredReports(filtered)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-purple-100 text-purple-800">Owner</Badge>
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800">Manager</Badge>
      case "employee":
        return <Badge className="bg-green-100 text-green-800">Employee</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const exportReport = (report: any) => {
    const blob = new Blob([report.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.role}-report-${report.date}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading report history...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Report History
          </CardTitle>
          <CardDescription>View, search, and manage all generated reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-[240px] justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reports found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getRoleBadge(report.role)}
                        {getDeliveryStatusBadge(report.delivery_status)}
                      </div>
                      <p className="font-medium text-sm">{format(new Date(report.date), "EEEE, MMM dd, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">
                        Generated {format(new Date(report.generated_at), "MMM dd 'at' HH:mm")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>
                            {report.role.charAt(0).toUpperCase() + report.role.slice(1)} Report -{" "}
                            {format(new Date(report.date), "MMM dd, yyyy")}
                          </DialogTitle>
                          <DialogDescription>
                            Generated on {format(new Date(report.generated_at), "MMM dd, yyyy 'at' HH:mm")}
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] w-full">
                          <div className="prose prose-sm max-w-none p-4">
                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                              {report.content}
                            </pre>
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="sm" onClick={() => exportReport(report)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
