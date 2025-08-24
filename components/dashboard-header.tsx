"use client"

import { useAuth } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LogOut, Settings, BarChart3, Database, FileText } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const [selectedLocation, setSelectedLocation] = useState("all")
  const pathname = usePathname()

  if (!user) return null

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/data", label: "Data", icon: Database },
    { href: "/reports", label: "Reports", icon: FileText },
  ]

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">DQ</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Dairy Queen Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.firstName || user.email}</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={isActive ? "default" : "ghost"} size="sm" className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Role Badge */}
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              {user.role}
            </Badge>

            {/* Location Selector */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="DQ001">DQ001 - Downtown</SelectItem>
                <SelectItem value="DQ002">DQ002 - Mall</SelectItem>
                <SelectItem value="DQ003">DQ003 - Airport</SelectItem>
                <SelectItem value="DQ004">DQ004 - University</SelectItem>
                <SelectItem value="DQ005">DQ005 - Suburban</SelectItem>
                <SelectItem value="DQ006">DQ006 - Highway</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
