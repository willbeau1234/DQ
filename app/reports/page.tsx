"use client"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportGenerator } from "@/components/reports/report-generator"
import { ReportHistory } from "@/components/reports/report-history"
import { ScheduledReports } from "@/components/reports/scheduled-reports"
import { CustomReportBuilder } from "@/components/reports/custom-report-builder"
import { FileText, Calendar, History, Zap } from "lucide-react"

function ReportsContent() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate AI-powered insights and reports</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-center space-x-3">
            <Zap className="h-8 w-8 text-orange-600" />
            <div>
              <p className="font-semibold text-orange-900">Quick Report</p>
              <p className="text-sm text-orange-700">Generate now</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Schedule</p>
              <p className="text-sm text-blue-700">Auto reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4 flex items-center space-x-3">
            <History className="h-8 w-8 text-gray-600" />
            <div>
              <p className="font-semibold text-gray-900">History</p>
              <p className="text-sm text-gray-700">Past reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 flex items-center space-x-3">
            <FileText className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Templates</p>
              <p className="text-sm text-green-700">Custom formats</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="custom" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="custom">Custom Builder</TabsTrigger>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="custom">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="generate">
          <ReportGenerator />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledReports />
        </TabsContent>

        <TabsContent value="history">
          <ReportHistory />
        </TabsContent>
      </Tabs>
      </main>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <AuthGuard>
      <ReportsContent />
    </AuthGuard>
  )
}
