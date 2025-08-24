"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, MapPin, Users, DollarSign, Clock } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useState } from "react"

interface LocationData {
  id: string
  name: string
  address: string
  revenue: number
  transactions: number
  laborCost: number
  driveThruTime: number
  customerSatisfaction: number
  trend: "up" | "down" | "stable"
  trendValue: number
  status: "excellent" | "good" | "needs-attention"
}

export function LocationOverview() {
  const [timeRange, setTimeRange] = useState("7d")
  const [sortBy, setSortBy] = useState("revenue")

  const locations: LocationData[] = [
    {
      id: "DQ001",
      name: "Downtown Location",
      address: "123 Main St, Downtown",
      revenue: 4850,
      transactions: 247,
      laborCost: 728.5,
      driveThruTime: 125,
      customerSatisfaction: 4.2,
      trend: "up",
      trendValue: 12,
      status: "good",
    },
    {
      id: "DQ002",
      name: "Mall Location",
      address: "456 Mall Blvd, Shopping Center",
      revenue: 5120,
      transactions: 268,
      laborCost: 780.0,
      driveThruTime: 118,
      customerSatisfaction: 4.5,
      trend: "up",
      trendValue: 8,
      status: "excellent",
    },
    {
      id: "DQ003",
      name: "Airport Location",
      address: "789 Airport Way, Terminal 2",
      revenue: 6200,
      transactions: 312,
      laborCost: 877.5,
      driveThruTime: 95,
      customerSatisfaction: 4.8,
      trend: "up",
      trendValue: 15,
      status: "excellent",
    },
    {
      id: "DQ004",
      name: "University Location",
      address: "321 Campus Dr, University District",
      revenue: 3800,
      transactions: 195,
      laborCost: 665.0,
      driveThruTime: 140,
      customerSatisfaction: 3.9,
      trend: "down",
      trendValue: -5,
      status: "needs-attention",
    },
    {
      id: "DQ005",
      name: "Suburban Location",
      address: "654 Suburban Ave, Residential Area",
      revenue: 4200,
      transactions: 218,
      laborCost: 693.0,
      driveThruTime: 110,
      customerSatisfaction: 4.3,
      trend: "stable",
      trendValue: 2,
      status: "good",
    },
    {
      id: "DQ006",
      name: "Highway Location",
      address: "987 Highway 101, Mile Marker 45",
      revenue: 5500,
      transactions: 285,
      laborCost: 825.0,
      driveThruTime: 105,
      customerSatisfaction: 4.1,
      trend: "up",
      trendValue: 10,
      status: "good",
    },
  ]

  const sortedLocations = [...locations].sort((a, b) => {
    switch (sortBy) {
      case "revenue":
        return b.revenue - a.revenue
      case "transactions":
        return b.transactions - a.transactions
      case "satisfaction":
        return b.customerSatisfaction - a.customerSatisfaction
      case "efficiency":
        return a.driveThruTime - b.driveThruTime
      default:
        return 0
    }
  })

  const totalRevenue = locations.reduce((sum, loc) => sum + loc.revenue, 0)
  const revenueDistribution = locations.map((loc) => ({
    name: loc.id,
    value: loc.revenue,
    percentage: ((loc.revenue / totalRevenue) * 100).toFixed(1),
  }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200"
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "needs-attention":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Sort by Revenue</SelectItem>
              <SelectItem value="transactions">Sort by Transactions</SelectItem>
              <SelectItem value="satisfaction">Sort by Satisfaction</SelectItem>
              <SelectItem value="efficiency">Sort by Efficiency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline">Export Report</Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              <div>
                <div className="text-2xl font-bold">
                  {locations.reduce((sum, loc) => sum + loc.transactions, 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(locations.reduce((sum, loc) => sum + loc.driveThruTime, 0) / locations.length)}s
                </div>
                <p className="text-sm text-muted-foreground">Avg Drive-Thru Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" />
              <div>
                <div className="text-2xl font-bold">{locations.length}</div>
                <p className="text-sm text-muted-foreground">Active Locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Cards and Revenue Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Location Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedLocations.map((location, index) => (
              <Card key={location.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                      <CardDescription className="text-sm">{location.id}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <Badge className={getStatusColor(location.status)}>{location.status.replace("-", " ")}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-semibold">${location.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Transactions</p>
                      <p className="font-semibold">{location.transactions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Drive-Thru</p>
                      <p className="font-semibold">{location.driveThruTime}s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Satisfaction</p>
                      <p className="font-semibold">{location.customerSatisfaction}/5</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 text-sm">
                      {location.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : location.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-gray-400" />
                      )}
                      <span
                        className={
                          location.trend === "up"
                            ? "text-green-600"
                            : location.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                        }
                      >
                        {location.trend === "stable" ? "Stable" : `${Math.abs(location.trendValue)}%`}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Revenue Distribution</h3>
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {revenueDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {revenueDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: index % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
