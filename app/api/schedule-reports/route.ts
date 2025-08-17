import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { storeId, scheduleConfig } = await request.json()

    if (!storeId || !scheduleConfig) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Update or create delivery preferences
    const { data, error } = await supabase
      .from("delivery_preferences")
      .upsert({
        store_id: storeId,
        ...scheduleConfig,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error updating delivery preferences:", error)
      return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error scheduling reports:", error)
    return NextResponse.json({ error: "Failed to schedule reports" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")

    if (!storeId) {
      return NextResponse.json({ error: "Store ID required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase.from("delivery_preferences").select("*").eq("store_id", storeId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching delivery preferences:", error)
      return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
    }

    return NextResponse.json({ data: data || null })
  } catch (error) {
    console.error("Error fetching delivery preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}
