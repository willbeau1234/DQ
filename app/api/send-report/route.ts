import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendReportEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { reportId, recipients, deliveryMethod } = await request.json()

    if (!reportId || !recipients || !deliveryMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Get the report data
    const { data: report, error: reportError } = await supabase
      .from("daily_reports")
      .select("*")
      .eq("id", reportId)
      .single()

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Get store information
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("name, location")
      .eq("id", report.store_id)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Send emails to recipients
    const emailPromises = recipients.map(async (recipient: any) => {
      if (deliveryMethod === "email" || deliveryMethod === "both") {
        return sendReportEmail({
          to: recipient.email,
          recipientName: recipient.name,
          storeName: store.name,
          storeLocation: store.location,
          reportDate: report.date,
          reportRole: report.role,
          reportContent: report.content,
        })
      }
    })

    await Promise.all(emailPromises.filter(Boolean))

    // Log delivery
    await supabase.from("delivery_logs").insert({
      report_id: reportId,
      delivery_method: deliveryMethod,
      recipients: recipients.map((r: any) => r.email),
      status: "sent",
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: "Report sent successfully" })
  } catch (error) {
    console.error("Error sending report:", error)
    return NextResponse.json({ error: "Failed to send report" }, { status: 500 })
  }
}
