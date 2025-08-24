"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useState } from "react"
import { MapPin, Clock, DollarSign, AlertTriangle, Star } from "lucide-react"

export function LocationDetails() {
  const [selectedLocation, setSelectedLocation] = useState("DQ001")

  const locations = [
    { id: "DQ001", name: "Downtown Location" },
    { id: "DQ002", name: "Mall Location" },
    { id: "DQ003", name: "Airport Location" },
    { id: "DQ004", name: "University Location" },
    { id: "DQ005", name: "Suburban Location" },
    { id: "DQ006", name: "Highway Location" },
  ]

  const locationDetails = {
    DQ001: {
      name: "Downtown Location",
      address: "123 Main St, Downtown",
      manager: "Sarah Johnson",
      phone: "(555) 123-4567",
      openHours: "6:00 AM - 11:00 PM",
      revenue: 4850,
      transactions: 247,
      laborCost: 728.5,
      driveThruTime: 125,
      customerSatisfaction: 4.2,
      status: "good",
      alerts: [
        { type: "warning", message: "Drive-thru times above target (125s vs 90s goal)" },
        { type: "info", message: "Labor costs within acceptable range" },
      ],
    },
    DQ002: {
      name: "Mall Location",
      address: "456 Mall Blvd, Shopping Center",
      manager: "Mike Chen",
      phone: "(555) 234-5678",
      openHours: "10:00 AM - 10:00 PM",
      revenue: 5120,
      transactions: 268,
      laborCost: 780.0,
      driveThruTime: 118,
      customerSatisfaction: 4.5,
      status: "excellent",
      alerts: [{ type: "success", message: "All metrics performing above target" }],
    },
    // Add more location details as needed
  }

  const hourlyData = [
    { hour: "6AM", sales: 180, transactions: 12, driveThruTime: 95 },
    { hour: "7AM", sales: 320, transactions: 18, driveThruTime: 105 },
    { hour: "8AM", sales: 450, transactions: 25, driveThruTime: 115 },
    { hour: "9AM", sales: 380, transactions: 22, driveThruTime: 110 },
    { hour: "10AM", sales: 290, transactions: 16, driveThruTime: 100 },
    { hour: "11AM", sales: 420, transactions: 24, driveThruTime: 120 },
    { hour: "12PM", sales: 680, transactions: 38, driveThruTime: 135 },
    { hour: "1PM", sales: 720, transactions: 42, driveThruTime: 140 },
    { hour: "2PM", sales: 580, transactions: 32, driveThruTime: 125 },
    { hour: "3PM", sales: 390, transactions: 21, driveThruTime: 115 },
    { hour: "4PM", sales: 460, transactions: 26, driveThruTime: 120 },
    { hour: "5PM", sales: 620, transactions: 35, driveThruTime: 130 },
    { hour: "6PM", sales: 750, transactions: 41, driveThruTime: 145 },
    { hour: "7PM", sales: 680, transactions: 38, driveThruTime: 135 },
    { hour: "8PM", sales: 520, transactions: 29, driveThruTime: 125 },
    { hour: "9PM", sales: 380, transactions: 22, driveThruTime: 115 },
    { hour: "10PM", sales: 240, transactions: 14, driveThruTime: 105 },
  ]

  const productMix = [
    { name: "Ice Cream", value: 45, color: "hsl(var(--primary))" },
    { name: "Burgers", value: 25, color: "hsl(var(--secondary))" },
    { name: "Chicken", value: 15, color: "hsl(var(--chart-3))" },
    { name: "Beverages", value: 10, color: "hsl(var(--chart-4))" },
    { name: "Other", value: 5, color: "hsl(var(--chart-5))" },
  ]

  const currentLocation = locationDetails[selectedLocation as keyof typeof locationDetails] || locationDetails.DQ001

  return (
    <div className="space-y-6">
      {/* Location Selector */}
      <div className="flex justify-between items-center">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.id} - {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">Generate Location Report</Button>
      </div>

      {/* Location Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{currentLocation.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{currentLocation.address}</p>
              <p className="text-sm">Manager: {currentLocation.manager}</p>
              <p className="text-sm">Phone: {currentLocation.phone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                <span className="font-semibold">Hours</span>
              </div>
              <p className="text-sm">{currentLocation.openHours}</p>
              <Badge
                className={
                  currentLocation.status === "excellent" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                }
              >
                {currentLocation.status === "excellent" ? "Excellent" : "Good"} Performance
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-semibold">Today's Revenue</span>
              </div>
              <p className="text-2xl font-bold">${currentLocation.revenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{currentLocation.transactions} transactions</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary" />
                <span className="font-semibold">Satisfaction</span>
              </div>
              <p className="text-2xl font-bold">{currentLocation.customerSatisfaction}/5</p>
              <p className="text-sm text-muted-foreground">Drive-thru: {currentLocation.driveThruTime}s avg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {currentLocation.alerts.length > 0 && (
        <div className="space-y-2">
          {currentLocation.alerts.map((alert, index) => (
            <Alert
              key={index}
              className={
                alert.type === "warning"
                  ? "border-orange-200 bg-orange-50"
                  : alert.type === "success"
                    ? "border-green-200 bg-green-50"
                    : "border-blue-200 bg-blue-50"
              }
            >
              <AlertTriangle
                className={`h-4 w-4 ${
                  alert.type === "warning"
                    ? "text-orange-600"
                    : alert.type === "success"
                      ? "text-green-600"
                      : "text-blue-600"
                }`}
              />
              <AlertDescription
                className={
                  alert.type === "warning"
                    ? "text-orange-800"
                    : alert.type === "success"
                      ? "text-green-800"
                      : "text-blue-800"
                }
              >
                {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="products">Product Mix</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Sales Performance</CardTitle>
                <CardDescription>Revenue breakdown throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Customer traffic patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="transactions" stroke="hsl(var(--secondary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Drive-Thru Performance</CardTitle>
              <CardDescription>Service time trends throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}s`, "Service Time"]} />
                  <Line type="monotone" dataKey="driveThruTime" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Mix</CardTitle>
                <CardDescription>Revenue distribution by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productMix}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {productMix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Revenue Share"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Detailed breakdown by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productMix.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: product.color }} />
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{product.value}%</p>
                        <p className="text-sm text-muted-foreground">
                          ${Math.round((currentLocation.revenue * product.value) / 100).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
