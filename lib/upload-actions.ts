"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function uploadCSV(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: "Authentication required" }
    }

    const file = formData.get("file") as File
    const storeId = formData.get("storeId") as string

    if (!file || !storeId) {
      return { error: "File and store ID are required" }
    }

    // Validate file type
    if (file.type !== "text/csv") {
      return { error: "Please upload a CSV file" }
    }

    // Create upload record
    const { data: uploadRecord, error: uploadError } = await supabase
      .from("data_uploads")
      .insert({
        store_id: storeId,
        uploaded_by: user.id,
        file_name: file.name,
        file_size: file.size,
        upload_date: new Date().toISOString().split("T")[0],
        status: "processing",
      })
      .select()
      .single()

    if (uploadError) {
      return { error: "Failed to create upload record" }
    }

    // Process CSV file
    const csvText = await file.text()
    const processResult = await processCSVData(csvText, storeId, uploadRecord.id, supabase)

    if (processResult.success) {
      // Update upload status to completed
      await supabase
        .from("data_uploads")
        .update({
          status: "completed",
          processed_records: processResult.recordCount,
        })
        .eq("id", uploadRecord.id)

      return { success: `Successfully processed ${processResult.recordCount} records` }
    } else {
      // Update upload status to failed
      await supabase
        .from("data_uploads")
        .update({
          status: "failed",
          error_message: processResult.error,
        })
        .eq("id", uploadRecord.id)

      return { error: processResult.error }
    }
  } catch (error) {
    console.error("Upload error:", error)
    return { error: "Upload failed. Please try again." }
  }
}

async function processCSVData(csvText: string, storeId: string, uploadId: string, supabase: any) {
  try {
    const lines = csvText.split("\n").filter((line) => line.trim())
    if (lines.length < 2) {
      return { error: "CSV file must contain headers and at least one data row" }
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const dataRows = lines.slice(1)

    // Map common column names to our schema
    const columnMap: { [key: string]: string } = {
      date: "data_date",
      sales: "total_sales",
      total_sales: "total_sales",
      revenue: "total_sales",
      transactions: "transaction_count",
      transaction_count: "transaction_count",
      labor_hours: "labor_hours",
      labor_cost: "labor_cost",
      food_cost: "food_cost",
      customers: "customer_count",
      customer_count: "customer_count",
      drive_thru_time: "drive_thru_time",
      order_accuracy: "order_accuracy",
      waste: "waste_amount",
      waste_amount: "waste_amount",
    }

    let processedCount = 0

    for (const row of dataRows) {
      const values = row.split(",").map((v) => v.trim())
      if (values.length !== headers.length) continue

      const rowData: any = { store_id: storeId }

      // Map CSV columns to database columns
      headers.forEach((header, index) => {
        const dbColumn = columnMap[header]
        if (dbColumn && values[index]) {
          if (dbColumn === "data_date") {
            // Parse date
            const date = new Date(values[index])
            if (!isNaN(date.getTime())) {
              rowData[dbColumn] = date.toISOString().split("T")[0]
            }
          } else {
            // Parse numeric values
            const numValue = Number.parseFloat(values[index])
            if (!isNaN(numValue)) {
              rowData[dbColumn] = numValue
            }
          }
        }
      })

      // Only insert if we have a valid date and at least one metric
      if (rowData.data_date && Object.keys(rowData).length > 2) {
        // Calculate derived metrics
        if (rowData.total_sales && rowData.transaction_count) {
          rowData.average_ticket = rowData.total_sales / rowData.transaction_count
        }
        if (rowData.labor_cost && rowData.total_sales) {
          rowData.labor_percentage = (rowData.labor_cost / rowData.total_sales) * 100
        }
        if (rowData.food_cost && rowData.total_sales) {
          rowData.food_cost_percentage = (rowData.food_cost / rowData.total_sales) * 100
        }

        // Upsert the data (insert or update if exists)
        const { error } = await supabase.from("daily_data").upsert(rowData, {
          onConflict: "store_id,data_date",
          ignoreDuplicates: false,
        })

        if (!error) {
          processedCount++
        }
      }
    }

    return { success: true, recordCount: processedCount }
  } catch (error) {
    console.error("CSV processing error:", error)
    return { error: "Failed to process CSV data" }
  }
}
