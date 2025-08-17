import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import DataUploadSection from "@/components/data-upload-section"
import RecentUploads from "@/components/recent-uploads"
import { OwnerDashboard } from "@/components/owner-dashboard"
import { ManagerDashboard } from "@/components/manager-dashboard"
import { EmployeeDashboard } from "@/components/employee-dashboard"
import { Tabs, TabsContent } from "@/components/ui/tabs" // Assuming Tabs and TabsContent are imported from a UI component library
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default async function DashboardPage() {
  // If Supabase is not configured, show setup message
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-bold mb-4 text-slate-900">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Get the user from the server
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  const renderDashboardContent = () => {
    switch (profile?.role) {
      case "owner":
        return <OwnerDashboard user={user} profile={profile} />
      case "manager":
        return <ManagerDashboard user={user} profile={profile} />
      case "employee":
        return <EmployeeDashboard user={user} profile={profile} />
      default:
        return (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DataUploadSection storeId={profile?.store_id} />
            </div>
            <div>
              <RecentUploads userId={user.id} />
            </div>
            <Tabs defaultValue="analytics">
              <TabsContent value="analytics" className="space-y-4">
                <AnalyticsDashboard storeId={profile?.store_id} />
              </TabsContent>
            </Tabs>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">{renderDashboardContent()}</main>
    </div>
  )
}
