"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Mail, Sparkles, FileText } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function ReportGenerator() {
  const [reportType, setReportType] = useState("")
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)

  const locations = [
    { id: "DQ001", name: "Downtown Location" },
    { id: "DQ002", name: "Mall Location" },
    { id: "DQ003", name: "Highway Location" },
    { id: "DQ004", name: "University Location" },
    { id: "DQ005", name: "Suburban Location" },
    { id: "DQ006", name: "Airport Location" },
  ]

  const reportTypes = [
    { value: "daily", label: "Daily Operations Report", description: "Sales, labor, and operational metrics" },
    { value: "weekly", label: "Weekly Performance Report", description: "Trends and comparative analysis" },
    { value: "monthly", label: "Monthly Business Review", description: "Comprehensive business insights" },
    { value: "custom", label: "Custom Analysis", description: "Tailored insights and recommendations" },
  ]

  const handleLocationToggle = (locationId: string) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId],
    )
  }

  const generateReport = async () => {
    setIsGenerating(true)

    try {
      // Call the real AI API
      const response = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          locations: selectedLocations,
          dateRange,
          metrics: {
            // Add sample metrics - in production this would come from your database
            revenue: Math.floor(Math.random() * 50000) + 20000,
            transactions: Math.floor(Math.random() * 1000) + 500,
            laborCost: Math.floor(Math.random() * 10) + 15,
            customerSatisfaction: (Math.random() * 2 + 3).toFixed(1),
          }
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedReport(data.report)
      } else {
        throw new Error(data.error || 'Failed to generate report')
      }
    } catch (error) {
      console.error('Error generating AI report:', error)
      
      // Fallback to mock data if AI fails
      const mockReport = {
        id: `report_${Date.now()}`,
        type: reportType,
        locations: selectedLocations,
        dateRange,
        generatedAt: new Date(),
        insights: [
          "AI service temporarily unavailable - showing sample insights",
          "Revenue performance tracking across selected locations",
          "Labor efficiency within acceptable ranges",
          "Customer satisfaction maintaining steady levels",
        ],
        recommendations: [
          "Monitor AI service connectivity for future reports",
          "Consider manual data review during AI downtime",
          "Maintain current operational standards",
        ],
        keyMetrics: {
          totalRevenue: 28450.75,
          avgTransactionValue: 12.85,
          customerCount: 2214,
          laborEfficiency: 94.2,
        },
      }
      setGeneratedReport(mockReport)
    }

    setIsGenerating(false)
  }

  const exportReport = async (format: "pdf" | "csv" | "email") => {
    if (format === "email" && generatedReport) {
      try {
        const response = await fetch('/api/email/send-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: 'user@example.com', // In production, get from user profile
            reportSections: [], // Convert report to sections format
            scheduledTime: 'Manual Send',
            userEmail: 'user@example.com',
            userName: 'Dashboard User'
          }),
        })

        const data = await response.json()
        
        if (data.success) {
          alert('Report email sent successfully!')
        } else {
          alert('Failed to send report email: ' + data.error)
        }
      } catch (error) {
        console.error('Error sending email:', error)
        alert('Failed to send report email')
      }
    } else {
      // Mock export functionality for PDF/CSV
      console.log(`Exporting report as ${format}`)
      alert(`${format.toUpperCase()} export functionality coming soon!`)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-600" />
            AI Report Generator
          </CardTitle>
          <CardDescription>Generate intelligent insights and recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Locations</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={location.id}
                    checked={selectedLocations.includes(location.id)}
                    onCheckedChange={() => handleLocationToggle(location.id)}
                  />
                  <Label htmlFor={location.id} className="text-sm">
                    {location.name}
                  </Label>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedLocations(locations.map((l) => l.id))}>
              Select All
            </Button>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Date Range</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateReport}
            disabled={!reportType || selectedLocations.length === 0 || isGenerating}
            className="w-full bg-orange-600 hover:bg-orange-700"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating AI Insights...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Report */}
      {generatedReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Report</CardTitle>
                <CardDescription>
                  {reportTypes.find((t) => t.value === generatedReport.type)?.label} • Generated{" "}
                  {format(generatedReport.generatedAt, "PPP p")}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportReport("csv")}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportReport("email")}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div>
              <h3 className="font-semibold mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    ${generatedReport.keyMetrics.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Total Revenue</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">
                    ${generatedReport.keyMetrics.avgTransactionValue}
                  </div>
                  <div className="text-sm text-blue-600">Avg Transaction</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">
                    {generatedReport.keyMetrics.customerCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600">Customers</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">
                    {generatedReport.keyMetrics.laborEfficiency}%
                  </div>
                  <div className="text-sm text-orange-600">Labor Efficiency</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* AI Insights */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-600" />
                AI Insights
              </h3>
              <div className="space-y-2">
                {generatedReport.insights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Badge variant="secondary" className="mt-0.5">
                      {index + 1}
                    </Badge>
                    <p className="text-sm text-blue-900">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold mb-3">Recommendations</h3>
              <div className="space-y-2">
                {generatedReport.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <Badge variant="outline" className="mt-0.5 border-orange-300 text-orange-700">
                      Action
                    </Badge>
                    <p className="text-sm text-orange-900">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
