"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataUpload } from "@/components/data/data-upload"
import { ManualEntry } from "@/components/data/manual-entry"
import { DataHistory } from "@/components/data/data-history"

export default function DataPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Data Management</h2>
              <p className="text-muted-foreground">Upload, enter, and manage your restaurant data</p>
            </div>

            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">CSV Upload</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="history">Data History</TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <DataUpload />
              </TabsContent>

              <TabsContent value="manual">
                <ManualEntry />
              </TabsContent>

              <TabsContent value="history">
                <DataHistory />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
