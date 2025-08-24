"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard-header"
import { OwnerDashboard } from "@/components/dashboards/owner-dashboard"
import { ManagerDashboard } from "@/components/dashboards/manager-dashboard"
import { ShiftLeadDashboard } from "@/components/dashboards/shift-lead-dashboard"
import { useAuth } from "@/components/auth-guard"

function DashboardContent() {
  const { user } = useAuth()

  if (!user) return null

  const renderDashboard = () => {
    switch (user.role) {
      case "owner":
        return <OwnerDashboard />
      case "manager":
        return <ManagerDashboard />
      case "shift-lead":
        return <ShiftLeadDashboard />
      default:
        return <OwnerDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6">{renderDashboard()}</main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
