"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Mail, Plus, Settings, Trash2 } from "lucide-react"

interface ScheduledReport {
  id: string
  name: string
  type: string
  frequency: string
  time: string
  recipients: string[]
  locations: string[]
  isActive: boolean
  nextRun: Date
}

export function ScheduledReports() {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: "1",
      name: "Daily Operations Summary",
      type: "daily",
      frequency: "daily",
      time: "08:00",
      recipients: ["owner@dq.com", "manager@dq.com"],
      locations: ["DQ001", "DQ002", "DQ003"],
      isActive: true,
      nextRun: new Date(2025, 7, 24, 8, 0),
    },
    {
      id: "2",
      name: "Weekly Performance Review",
      type: "weekly",
      frequency: "weekly",
      time: "09:00",
      recipients: ["owner@dq.com"],
      locations: ["all"],
      isActive: true,
      nextRun: new Date(2025, 7, 26, 9, 0),
    },
  ])

  const [showNewReportForm, setShowNewReportForm] = useState(false)
  const [newReport, setNewReport] = useState({
    name: "",
    type: "",
    frequency: "",
    time: "",
    recipients: "",
    locations: [],
  })

  const toggleReportStatus = (id: string) => {
    setScheduledReports((prev) =>
      prev.map((report) => (report.id === id ? { ...report, isActive: !report.isActive } : report)),
    )
  }

  const deleteReport = (id: string) => {
    setScheduledReports((prev) => prev.filter((report) => report.id !== id))
  }

  const addNewReport = () => {
    if (!newReport.name || !newReport.type || !newReport.frequency) return

    const report: ScheduledReport = {
      id: Date.now().toString(),
      name: newReport.name,
      type: newReport.type,
      frequency: newReport.frequency,
      time: newReport.time || "08:00",
      recipients: newReport.recipients.split(",").map((email) => email.trim()),
      locations: newReport.locations,
      isActive: true,
      nextRun: new Date(2025, 7, 24, 8, 0),
    }

    setScheduledReports((prev) => [...prev, report])
    setNewReport({ name: "", type: "", frequency: "", time: "", recipients: "", locations: [] })
    setShowNewReportForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Reports</h2>
          <p className="text-gray-600">Automate your reporting workflow</p>
        </div>
        <Button onClick={() => setShowNewReportForm(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" />
          New Schedule
        </Button>
      </div>

      {/* New Report Form */}
      {showNewReportForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Scheduled Report</CardTitle>
            <CardDescription>Set up automatic report generation and delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportName">Report Name</Label>
                <Input
                  id="reportName"
                  value={newReport.name}
                  onChange={(e) => setNewReport((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Daily Operations Summary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select
                  value={newReport.type}
                  onValueChange={(value) => setNewReport((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Operations</SelectItem>
                    <SelectItem value="weekly">Weekly Performance</SelectItem>
                    <SelectItem value="monthly">Monthly Review</SelectItem>
                    <SelectItem value="custom">Custom Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newReport.frequency}
                  onValueChange={(value) => setNewReport((prev) => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newReport.time}
                  onChange={(e) => setNewReport((prev) => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Email Recipients</Label>
              <Input
                id="recipients"
                value={newReport.recipients}
                onChange={(e) => setNewReport((prev) => ({ ...prev, recipients: e.target.value }))}
                placeholder="email1@example.com, email2@example.com"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={addNewReport} className="bg-orange-600 hover:bg-orange-700">
                Create Schedule
              </Button>
              <Button variant="outline" onClick={() => setShowNewReportForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Reports List */}
      <div className="space-y-4">
        {scheduledReports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{report.name}</h3>
                    <Badge variant={report.isActive ? "default" : "secondary"}>
                      {report.isActive ? "Active" : "Paused"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {report.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="capitalize">{report.frequency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{report.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{report.recipients.length} recipient(s)</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Next run: {report.nextRun.toLocaleDateString()} at{" "}
                    {report.nextRun.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch checked={report.isActive} onCheckedChange={() => toggleReportStatus(report.id)} />
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteReport(report.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {scheduledReports.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scheduled Reports</h3>
            <p className="text-gray-600 mb-4">Create your first automated report to get started</p>
            <Button onClick={() => setShowNewReportForm(true)} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Schedule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
