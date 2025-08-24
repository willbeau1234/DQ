"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, FileText, Mail, Search, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface ReportHistoryItem {
  id: string
  name: string
  type: string
  generatedAt: Date
  generatedBy: string
  status: "completed" | "failed" | "processing"
  locations: string[]
  fileSize: string
  recipients?: string[]
}

export function ReportHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const [reports] = useState<ReportHistoryItem[]>([
    {
      id: "1",
      name: "Daily Operations Summary",
      type: "daily",
      generatedAt: new Date(2025, 7, 23, 8, 0),
      generatedBy: "System (Scheduled)",
      status: "completed",
      locations: ["DQ001", "DQ002", "DQ003"],
      fileSize: "2.4 MB",
      recipients: ["owner@dq.com", "manager@dq.com"],
    },
    {
      id: "2",
      name: "Weekly Performance Review",
      type: "weekly",
      generatedAt: new Date(2025, 7, 19, 9, 0),
      generatedBy: "John Smith",
      status: "completed",
      locations: ["all"],
      fileSize: "5.1 MB",
    },
    {
      id: "3",
      name: "Monthly Business Review",
      type: "monthly",
      generatedAt: new Date(2025, 7, 1, 10, 0),
      generatedBy: "System (Scheduled)",
      status: "completed",
      locations: ["all"],
      fileSize: "12.8 MB",
      recipients: ["owner@dq.com"],
    },
    {
      id: "4",
      name: "Custom Labor Analysis",
      type: "custom",
      generatedAt: new Date(2025, 7, 22, 14, 30),
      generatedBy: "Sarah Johnson",
      status: "failed",
      locations: ["DQ004", "DQ005"],
      fileSize: "0 MB",
    },
    {
      id: "5",
      name: "Daily Operations Summary",
      type: "daily",
      generatedAt: new Date(2025, 7, 22, 8, 0),
      generatedBy: "System (Scheduled)",
      status: "processing",
      locations: ["DQ001", "DQ002", "DQ003"],
      fileSize: "0 MB",
    },
  ])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || report.type === filterType
    const matchesStatus = filterStatus === "all" || report.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      daily: "bg-blue-100 text-blue-800",
      weekly: "bg-purple-100 text-purple-800",
      monthly: "bg-orange-100 text-orange-800",
      custom: "bg-gray-100 text-gray-800",
    }

    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Report History</h2>
        <p className="text-gray-600">View and manage your generated reports</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Generated By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-gray-500">
                        {report.locations.includes("all") ? "All locations" : `${report.locations.length} location(s)`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(report.type)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{format(report.generatedAt, "MMM dd, yyyy")}</div>
                      <div className="text-gray-500">{format(report.generatedAt, "h:mm a")}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{report.generatedBy}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-sm">{report.fileSize}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {report.status === "completed" && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {report.recipients && (
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
