import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    const { storeId, date, ...dailyMetrics } = formData

    if (!storeId || !date) {
      return NextResponse.json({ error: "Store ID and date are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Calculate derived metrics
    const calculatedMetrics = calculateDerivedMetrics(dailyMetrics)

    // Check if data already exists for this date
    const { data: existingData } = await supabase
      .from("daily_data")
      .select("id")
      .eq("store_id", storeId)
      .eq("date", date)
      .single()

    let result
    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from("daily_data")
        .update({
          ...dailyMetrics,
          ...calculatedMetrics,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingData.id)
        .select()
        .single()

      result = { data, error }
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from("daily_data")
        .insert({
          store_id: storeId,
          date,
          ...dailyMetrics,
          ...calculatedMetrics,
        })
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      console.error("Error saving manual data:", result.error)
      return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error processing manual data:", error)
    return NextResponse.json({ error: "Failed to process data" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")
    const date = searchParams.get("date")

    if (!storeId || !date) {
      return NextResponse.json({ error: "Store ID and date are required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("daily_data")
      .select("*")
      .eq("store_id", storeId)
      .eq("date", date)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching manual data:", error)
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }

    return NextResponse.json({ data: data || null })
  } catch (error) {
    console.error("Error fetching manual data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

function calculateDerivedMetrics(metrics: any) {
  const totalSales = Number.parseFloat(metrics.total_sales) || 0
  const transactionCount = Number.parseInt(metrics.transaction_count) || 0
  const laborCost = Number.parseFloat(metrics.labor_cost) || 0
  const foodCost = Number.parseFloat(metrics.food_cost) || 0

  return {
    average_ticket: transactionCount > 0 ? totalSales / transactionCount : 0,
    labor_percentage: totalSales > 0 ? (laborCost / totalSales) * 100 : 0,
    food_percentage: totalSales > 0 ? (foodCost / totalSales) * 100 : 0,
  }
}
