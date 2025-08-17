import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface PerformanceMetricsProps {
  storeId: string
  role: string
}

export function PerformanceMetrics({ storeId, role }: PerformanceMetricsProps) {
  // Mock data - in real app, fetch from database
  const metrics = {
    owner: [
      { name: "Revenue Growth", value: 85, target: 100, status: "good" },
      { name: "Profit Margin", value: 72, target: 80, status: "warning" },
      { name: "Customer Satisfaction", value: 92, target: 90, status: "excellent" },
      { name: "Cost Control", value: 78, target: 85, status: "good" },
    ],
    manager: [
      { name: "Daily Sales Target", value: 83, target: 100, status: "good" },
      { name: "Labor Efficiency", value: 76, target: 80, status: "warning" },
      { name: "Food Cost Control", value: 88, target: 85, status: "excellent" },
      { name: "Team Performance", value: 91, target: 90, status: "excellent" },
    ],
    employee: [
      { name: "Customer Service", value: 96, target: 90, status: "excellent" },
      { name: "Speed of Service", value: 84, target: 85, status: "good" },
      { name: "Teamwork", value: 89, target: 85, status: "excellent" },
      { name: "Attendance", value: 100, target: 95, status: "excellent" },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "warning":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>
      default:
        return <Badge variant="secondary">Average</Badge>
    }
  }

  const roleMetrics = metrics[role as keyof typeof metrics] || metrics.owner

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Key performance indicators for your role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {roleMetrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{metric.name}</span>
              {getStatusBadge(metric.status)}
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={metric.value} className="flex-1" />
              <span className="text-sm text-muted-foreground">{metric.value}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
