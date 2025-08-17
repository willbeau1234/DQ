import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ProfitabilityAnalysisProps {
  storeId: string
}

export function ProfitabilityAnalysis({ storeId }: ProfitabilityAnalysisProps) {
  // Mock data - in real app, fetch from database
  const profitData = [
    { metric: "Gross Profit Margin", current: 68.5, previous: 65.2, trend: "up" },
    { metric: "Labor Cost %", current: 28.3, previous: 30.1, trend: "down" },
    { metric: "Food Cost %", current: 31.5, previous: 34.8, trend: "down" },
    { metric: "Net Profit Margin", current: 18.2, previous: 16.1, trend: "up" },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string, isGoodWhenUp = true) => {
    const isPositive = isGoodWhenUp ? trend === "up" : trend === "down"
    return isPositive ? "text-green-600" : "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profitability Analysis</CardTitle>
        <CardDescription>Key financial metrics and trends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profitData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">{item.metric}</p>
              <p className="text-2xl font-bold">{item.current}%</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {getTrendIcon(item.trend)}
                <span className={`text-sm font-medium ${getTrendColor(item.trend, !item.metric.includes("Cost"))}`}>
                  {Math.abs(item.current - item.previous).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
