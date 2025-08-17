import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportGenerator } from "@/components/report-generator"
import DataUploadSection from "@/components/data-upload-section"
import RecentUploads from "@/components/recent-uploads"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { OperationalTasks } from "@/components/operational-tasks"
import { StaffSchedule } from "@/components/staff-schedule"
import { Clock, Users, Target, AlertCircle } from "lucide-react"

interface ManagerDashboardProps {
  user: any
  profile: any
}

export function ManagerDashboard({ user, profile }: ManagerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Daily Operations Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,247</div>
            <p className="text-xs text-muted-foreground">Goal: $1,500</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff on Duty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 scheduled breaks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labor %</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5%</div>
            <p className="text-xs text-muted-foreground">Target: 25-30%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="reports">Daily Reports</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="data">Data Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <OperationalTasks storeId={profile?.store_id} />
            <PerformanceMetrics storeId={profile?.store_id} role="manager" />
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportGenerator storeId={profile?.store_id} userRole="manager" />
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <StaffSchedule storeId={profile?.store_id} />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DataUploadSection storeId={profile?.store_id} />
            </div>
            <div>
              <RecentUploads userId={user.id} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
