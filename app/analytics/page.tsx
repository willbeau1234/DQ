"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LocationOverview } from "@/components/analytics/location-overview"
import { ComparativeAnalysis } from "@/components/analytics/comparative-analysis"
import { LocationDetails } from "@/components/analytics/location-details"

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Multi-Location Analytics</h2>
              <p className="text-muted-foreground">Compare performance across all your Dairy Queen locations</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Location Overview</TabsTrigger>
                <TabsTrigger value="comparative">Comparative Analysis</TabsTrigger>
                <TabsTrigger value="details">Location Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <LocationOverview />
              </TabsContent>

              <TabsContent value="comparative">
                <ComparativeAnalysis />
              </TabsContent>

              <TabsContent value="details">
                <LocationDetails />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
