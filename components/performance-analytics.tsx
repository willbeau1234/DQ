"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface PerformanceAnalyticsProps {
  storeId: string
}

export function PerformanceAnalytics({ storeId }: PerformanceAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState("sales")
  const [selectedPeriod, setSelectedPeriod] = useState("30")

  useEffect(() => {
    fetchAnalytics()
  }, [storeId, selectedMetric, selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockAnalytics = {
        sales: {
          trend: [
            { date: "2024-12-01", value: 1200 },
            { date: "2024-12-02", value: 1350 },
            { date: "2024-12-03", value: 1180 },
            { date: "2024-12-04", value: 1420 },
            { date: "2024-12-05", value: 1380 },
            { date: "2024-12-06", value: 1500 },
            { date: "2024-12-07", value: 1650 },
          ],
          summary: {
            total: 9680,
            average: 1382.86,
            growth: 12.5,
            best_day: { date: "2024-12-07", value: 1650 },
            worst_day: { date: "2024-12-03", value: 1180 },
          },
        },
        transactions: {
          trend: [
            { date: "2024-12-01", value: 85 },
            { date: "2024-12-02", value: 92 },
            { date: "2024-12-03", value: 78 },
            { date: "2024-12-04", value: 98 },
            { date: "2024-12-05", value: 89 },
            { date: "2024-12-06", value: 105 },
            { date: "2024-12-07", value: 112 },
          ],
          summary: {
            total: 659,
            average: 94.14,
            growth: 8.3,
            best_day: { date: "2024-12-07", value: 112 },
            worst_day: { date: "2024-12-03", value: 78 },
          },
        },
      }

      setAnalytics(mockAnalytics[selectedMetric as keyof typeof mockAnalytics])
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case "sales":
        return "Sales ($)"
      case "transactions":
        return "Transactions"
      case "labor_percentage":
        return "Labor %"
      case "food_percentage":
        return "Food %"
      case "average_ticket":
        return "Average Ticket ($)"
      default:
        return metric
    }
  }

  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case "sales":
      case "average_ticket":
        return `$${value.toFixed(2)}`
      case "labor_percentage":
      case "food_percentage":
        return `${value.toFixed(1)}%`
      default:
        return value.toString()
    }
  }

  const getTrendIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getTrendColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading analytics...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
              <CardDescription>Track performance trends and identify opportunities</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="labor_percentage">Labor %</SelectItem>
                  <SelectItem value="food_percentage">Food %</SelectItem>
                  <SelectItem value="average_ticket">Average Ticket</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {analytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{formatValue(analytics.summary.total, selectedMetric)}</p>
                      </div>
                      <Target className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Average</p>
                        <p className="text-2xl font-bold">{formatValue(analytics.summary.average, selectedMetric)}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Growth</p>
                        <div className="flex items-center gap-2">
                          <p className={`text-2xl font-bold ${getTrendColor(analytics.summary.growth)}`}>
                            {analytics.summary.growth >= 0 ? "+" : ""}
                            {analytics.summary.growth.toFixed(1)}%
                          </p>
                          {getTrendIcon(analytics.summary.growth)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Best Day</p>
                      <p className="text-lg font-bold">
                        {formatValue(analytics.summary.best_day.value, selectedMetric)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analytics.summary.best_day.date).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="trend" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
                  <TabsTrigger value="comparison">Period Comparison</TabsTrigger>
                  <TabsTrigger value="insights">AI Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="trend" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{getMetricLabel(selectedMetric)} Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.trend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(value) =>
                              new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            }
                          />
                          <YAxis tickFormatter={(value) => formatValue(value, selectedMetric)} />
                          <Tooltip
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            formatter={(value: number) => [
                              formatValue(value, selectedMetric),
                              getMetricLabel(selectedMetric),
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ fill: "#2563eb" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Daily Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.trend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(value) =>
                              new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            }
                          />
                          <YAxis tickFormatter={(value) => formatValue(value, selectedMetric)} />
                          <Tooltip
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            formatter={(value: number) => [
                              formatValue(value, selectedMetric),
                              getMetricLabel(selectedMetric),
                            ]}
                          />
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="insights" className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Badge className="bg-green-100 text-green-800">Positive</Badge>
                          <div>
                            <p className="font-medium text-sm">Strong Growth Trend</p>
                            <p className="text-sm text-muted-foreground">
                              Your {getMetricLabel(selectedMetric).toLowerCase()} has shown consistent growth over the
                              selected period.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Badge className="bg-blue-100 text-blue-800">Insight</Badge>
                          <div>
                            <p className="font-medium text-sm">Weekend Performance</p>
                            <p className="text-sm text-muted-foreground">
                              Weekend days typically show 15-20% higher performance compared to weekdays.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Badge className="bg-yellow-100 text-yellow-800">Opportunity</Badge>
                          <div>
                            <p className="font-medium text-sm">Midweek Improvement</p>
                            <p className="text-sm text-muted-foreground">
                              Consider promotional activities on Tuesday-Thursday to boost midweek performance.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
