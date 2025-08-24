"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { useState } from "react"
import { TrendingUp, TrendingDown, Award, AlertTriangle } from "lucide-react"

export function ComparativeAnalysis() {
  const [metric, setMetric] = useState("revenue")
  const [timeRange, setTimeRange] = useState("7d")

  const locationData = [
    {
      location: "DQ001",
      name: "Downtown",
      revenue: 4850,
      transactions: 247,
      laborCost: 728.5,
      driveThruTime: 125,
      customerSatisfaction: 4.2,
      laborPercent: 15.0,
      avgOrderValue: 19.64,
    },
    {
      location: "DQ002",
      name: "Mall",
      revenue: 5120,
      transactions: 268,
      laborCost: 780.0,
      driveThruTime: 118,
      customerSatisfaction: 4.5,
      laborPercent: 15.2,
      avgOrderValue: 19.1,
    },
    {
      location: "DQ003",
      name: "Airport",
      revenue: 6200,
      transactions: 312,
      laborCost: 877.5,
      driveThruTime: 95,
      customerSatisfaction: 4.8,
      laborPercent: 14.2,
      avgOrderValue: 19.87,
    },
    {
      location: "DQ004",
      name: "University",
      revenue: 3800,
      transactions: 195,
      laborCost: 665.0,
      driveThruTime: 140,
      customerSatisfaction: 3.9,
      laborPercent: 17.5,
      avgOrderValue: 19.49,
    },
    {
      location: "DQ005",
      name: "Suburban",
      revenue: 4200,
      transactions: 218,
      laborCost: 693.0,
      driveThruTime: 110,
      customerSatisfaction: 4.3,
      laborPercent: 16.5,
      avgOrderValue: 19.27,
    },
    {
      location: "DQ006",
      name: "Highway",
      revenue: 5500,
      transactions: 285,
      laborCost: 825.0,
      driveThruTime: 105,
      customerSatisfaction: 4.1,
      laborPercent: 15.0,
      avgOrderValue: 19.3,
    },
  ]

  const performanceData = locationData.map((loc) => ({
    location: loc.name,
    Revenue: (loc.revenue / 1000).toFixed(1),
    Efficiency: Math.max(0, 100 - (loc.driveThruTime - 90) * 2),
    Satisfaction: loc.customerSatisfaction * 20,
    "Labor Control": Math.max(0, 100 - (loc.laborPercent - 15) * 10),
    Quality: loc.customerSatisfaction * 20,
  }))

  const getMetricColor = (value: number, metric: string) => {
    const thresholds = {
      revenue: { good: 5000, warning: 4000 },
      laborPercent: { good: 15, warning: 17 },
      driveThruTime: { good: 100, warning: 120 },
      customerSatisfaction: { good: 4.3, warning: 4.0 },
    }

    const threshold = thresholds[metric as keyof typeof thresholds]
    if (!threshold) return "text-foreground"

    if (metric === "laborPercent" || metric === "driveThruTime") {
      // Lower is better
      if (value <= threshold.good) return "text-green-600"
      if (value <= threshold.warning) return "text-yellow-600"
      return "text-red-600"
    } else {
      // Higher is better
      if (value >= threshold.good) return "text-green-600"
      if (value >= threshold.warning) return "text-yellow-600"
      return "text-red-600"
    }
  }

  const getBestPerformer = (metric: string) => {
    const sorted = [...locationData].sort((a, b) => {
      if (metric === "laborPercent" || metric === "driveThruTime") {
        return a[metric as keyof typeof a] - b[metric as keyof typeof a] // Lower is better
      }
      return b[metric as keyof typeof b] - a[metric as keyof typeof a] // Higher is better
    })
    return sorted[0]
  }

  const getWorstPerformer = (metric: string) => {
    const sorted = [...locationData].sort((a, b) => {
      if (metric === "laborPercent" || metric === "driveThruTime") {
        return b[metric as keyof typeof a] - a[metric as keyof typeof a] // Higher is worse
      }
      return a[metric as keyof typeof b] - b[metric as keyof typeof b] // Lower is worse
    })
    return sorted[0]
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue Comparison</SelectItem>
              <SelectItem value="efficiency">Operational Efficiency</SelectItem>
              <SelectItem value="satisfaction">Customer Satisfaction</SelectItem>
              <SelectItem value="labor">Labor Management</SelectItem>
            </SelectContent>
          </Select>

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
        </div>

        <Button variant="outline">Export Analysis</Button>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const best = getBestPerformer(metric)
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {best.name} ({best.location})
                    </span>
                    <Badge className="bg-green-100 text-green-800">Top</Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {metric === "revenue" && `$${best.revenue.toLocaleString()}`}
                    {metric === "efficiency" && `${best.driveThruTime}s avg`}
                    {metric === "satisfaction" && `${best.customerSatisfaction}/5`}
                    {metric === "labor" && `${best.laborPercent}%`}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {metric === "revenue" && "Highest daily revenue"}
                    {metric === "efficiency" && "Fastest drive-thru service"}
                    {metric === "satisfaction" && "Highest customer satisfaction"}
                    {metric === "labor" && "Best labor cost control"}
                  </p>
                </div>
              )
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const worst = getWorstPerformer(metric)
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {worst.name} ({worst.location})
                    </span>
                    <Badge variant="destructive">Action Needed</Badge>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {metric === "revenue" && `$${worst.revenue.toLocaleString()}`}
                    {metric === "efficiency" && `${worst.driveThruTime}s avg`}
                    {metric === "satisfaction" && `${worst.customerSatisfaction}/5`}
                    {metric === "labor" && `${worst.laborPercent}%`}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {metric === "revenue" && "Below average revenue performance"}
                    {metric === "efficiency" && "Slowest drive-thru service times"}
                    {metric === "satisfaction" && "Lowest customer satisfaction scores"}
                    {metric === "labor" && "Highest labor cost percentage"}
                  </p>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Location Comparison</CardTitle>
            <CardDescription>Side-by-side performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey={
                    metric === "revenue"
                      ? "revenue"
                      : metric === "efficiency"
                        ? "driveThruTime"
                        : metric === "satisfaction"
                          ? "customerSatisfaction"
                          : "laborPercent"
                  }
                  fill="hsl(var(--primary))"
                  name={
                    metric === "revenue"
                      ? "Revenue ($)"
                      : metric === "efficiency"
                        ? "Drive-Thru Time (s)"
                        : metric === "satisfaction"
                          ? "Satisfaction"
                          : "Labor %"
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>Multi-dimensional performance view</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="location" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Performance Score"
                  dataKey="Revenue"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                />
                <Radar
                  name="Efficiency"
                  dataKey="Efficiency"
                  stroke="hsl(var(--secondary))"
                  fill="hsl(var(--secondary))"
                  fillOpacity={0.1}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
          <CardDescription>Complete comparison across all key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                  <TableHead>Labor %</TableHead>
                  <TableHead>Drive-Thru Time</TableHead>
                  <TableHead>Satisfaction</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locationData.map((location) => (
                  <TableRow key={location.location}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{location.name}</p>
                        <p className="text-sm text-muted-foreground">{location.location}</p>
                      </div>
                    </TableCell>
                    <TableCell className={getMetricColor(location.revenue, "revenue")}>
                      ${location.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell>{location.transactions}</TableCell>
                    <TableCell>${location.avgOrderValue}</TableCell>
                    <TableCell className={getMetricColor(location.laborPercent, "laborPercent")}>
                      {location.laborPercent}%
                    </TableCell>
                    <TableCell className={getMetricColor(location.driveThruTime, "driveThruTime")}>
                      {location.driveThruTime}s
                    </TableCell>
                    <TableCell className={getMetricColor(location.customerSatisfaction, "customerSatisfaction")}>
                      {location.customerSatisfaction}/5
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Math.random() > 0.5 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">
                          {Math.random() > 0.5 ? "+" : "-"}
                          {Math.floor(Math.random() * 10 + 1)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
