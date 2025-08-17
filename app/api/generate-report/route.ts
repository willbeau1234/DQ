import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { storeId, date, role } = await request.json()

    if (!storeId || !date || !role) {
      return new Response("Store ID, date, and role are required", { status: 400 })
    }

    const supabase = createClient()

    // Get daily data for the specified date and store
    const { data: dailyData, error: dataError } = await supabase
      .from("daily_data")
      .select("*")
      .eq("store_id", storeId)
      .eq("date", date)
      .single()

    if (dataError || !dailyData) {
      return new Response("No data found for the specified date", { status: 404 })
    }

    // Get store information
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("name, location")
      .eq("id", storeId)
      .single()

    if (storeError || !store) {
      return new Response("Store not found", { status: 404 })
    }

    // Create role-specific prompt
    const systemPrompt = getSystemPromptForRole(role)
    const dataPrompt = createDataPrompt(dailyData, store, date)

    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: dataPrompt,
      system: systemPrompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating report:", error)
    return new Response("Failed to generate report", { status: 500 })
  }
}

function getSystemPromptForRole(role: string): string {
  const basePrompt =
    "You are an AI assistant specialized in analyzing Dairy Queen restaurant operations. Provide clear, actionable insights based on the daily performance data."

  switch (role) {
    case "owner":
      return `${basePrompt} Focus on high-level business metrics, profitability, trends, and strategic recommendations. Include comparisons to industry benchmarks where relevant.`

    case "manager":
      return `${basePrompt} Focus on operational efficiency, staff performance, inventory management, and day-to-day improvements. Provide specific actionable recommendations for tomorrow.`

    case "employee":
      return `${basePrompt} Focus on team performance, customer service highlights, and positive achievements. Keep the tone encouraging and highlight areas of success.`

    default:
      return basePrompt
  }
}

function createDataPrompt(dailyData: any, store: any, date: string): string {
  return `
Generate a comprehensive daily report for ${store.name} (${store.location}) for ${date}.

**Daily Performance Data:**
- Total Sales: $${dailyData.total_sales}
- Transaction Count: ${dailyData.transaction_count}
- Average Ticket: $${dailyData.average_ticket}
- Labor Hours: ${dailyData.labor_hours}
- Labor Cost: $${dailyData.labor_cost}
- Labor Percentage: ${dailyData.labor_percentage}%
- Food Cost: $${dailyData.food_cost}
- Food Percentage: ${dailyData.food_percentage}%
- Customer Count: ${dailyData.customer_count}
- Weather: ${dailyData.weather || "Not specified"}
- Special Events: ${dailyData.special_events || "None"}

**Analysis Requirements:**
1. Summarize key performance indicators
2. Identify strengths and areas for improvement
3. Compare metrics to typical industry standards
4. Provide 3-5 specific actionable recommendations
5. Highlight any concerning trends or exceptional performance
6. Consider external factors (weather, events) in your analysis

Format the report in a professional, easy-to-read structure with clear sections and bullet points.
  `
}
