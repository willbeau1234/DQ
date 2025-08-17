"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveGeneratedReport(storeId: string, date: string, role: string, content: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("daily_reports")
      .insert({
        store_id: storeId,
        date,
        role,
        content,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving report:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true, data }
  } catch (error) {
    console.error("Error saving report:", error)
    return { success: false, error: "Failed to save report" }
  }
}

export async function getReportHistory(storeId: string, limit = 10) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("daily_reports")
      .select("*")
      .eq("store_id", storeId)
      .order("generated_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching report history:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching report history:", error)
    return { success: false, error: "Failed to fetch report history" }
  }
}
