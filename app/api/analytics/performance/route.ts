import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")
    const period = searchParams.get("period") || "30" // days
    const metric = searchParams.get("metric") || "sales"

    if (!storeId) {
      return NextResponse.json({ error: "Store ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - Number.parseInt(period))

    const { data, error } = await supabase
      .from("daily_data")
      .select("*")
      .eq("store_id", storeId)
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching performance data:", error)
      return NextResponse.json({ error: "Failed to fetch performance data" }, { status: 500 })
    }

    // Calculate analytics
    const analytics = calculatePerformanceAnalytics(data, metric)

    return NextResponse.json({ data: analytics })
  } catch (error) {
    console.error("Error calculating performance analytics:", error)
    return NextResponse.json({ error: "Failed to calculate analytics" }, { status: 500 })
  }
}

function calculatePerformanceAnalytics(data: any[], metric: string) {
  if (!data || data.length === 0) {
    return {
      trend: [],
      summary: {
        total: 0,
        average: 0,
        growth: 0,
        best_day: null,
        worst_day: null,
      },
    }
  }

  const trend = data.map((item) => ({
    date: item.date,
    value: getMetricValue(item, metric),
  }))

  const values = trend.map((t) => t.value).filter((v) => v > 0)
  const total = values.reduce((sum, val) => sum + val, 0)
  const average = values.length > 0 ? total / values.length : 0

  // Calculate growth (comparing first half to second half)
  const midPoint = Math.floor(values.length / 2)
  const firstHalf = values.slice(0, midPoint)
  const secondHalf = values.slice(midPoint)

  const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length : 0
  const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length : 0
  const growth = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0

  const bestDay = trend.reduce((best, current) => (current.value > best.value ? current : best), trend[0])
  const worstDay = trend.reduce((worst, current) => (current.value < worst.value ? current : worst), trend[0])

  return {
    trend,
    summary: {
      total,
      average,
      growth,
      best_day: bestDay,
      worst_day: worstDay,
    },
  }
}

function getMetricValue(item: any, metric: string): number {
  switch (metric) {
    case "sales":
      return Number.parseFloat(item.total_sales) || 0
    case "transactions":
      return Number.parseInt(item.transaction_count) || 0
    case "labor_percentage":
      return Number.parseFloat(item.labor_percentage) || 0
    case "food_percentage":
      return Number.parseFloat(item.food_percentage) || 0
    case "average_ticket":
      return Number.parseFloat(item.average_ticket) || 0
    default:
      return 0
  }
}
