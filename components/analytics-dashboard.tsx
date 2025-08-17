"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportHistory } from "@/components/report-history"
import { PerformanceAnalytics } from "@/components/performance-analytics"
import { DeliveryHistory } from "@/components/delivery-history"

interface AnalyticsDashboardProps {
  storeId: string
}

export function AnalyticsDashboard({ storeId }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="reports">Report History</TabsTrigger>
          <TabsTrigger value="delivery">Delivery History</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceAnalytics storeId={storeId} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportHistory storeId={storeId} />
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <DeliveryHistory storeId={storeId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
