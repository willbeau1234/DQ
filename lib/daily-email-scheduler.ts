import { createClient } from "@/lib/supabase/server"
import { sendReportEmail } from "@/lib/email-service"
import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function sendDailyReports() {
  console.log(`[SCHEDULER] Starting daily email process at ${new Date().toISOString()}`)
  
  const supabase = createClient()
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const reportDate = yesterday.toISOString().split('T')[0]
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('[SCHEDULER] Error getting user:', userError)
      return { success: false, error: 'User not authenticated' }
    }

    // Get all stores for the user (assuming user owns the stores)
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, name, address')

    if (storesError) {
      console.error('[SCHEDULER] Error fetching stores:', storesError)
      return { success: false, error: 'Failed to fetch stores' }
    }

    if (!stores || stores.length === 0) {
      console.log('[SCHEDULER] No stores found')
      return { success: true, message: 'No stores found' }
    }

    const results = []

    for (const store of stores) {
      try {
        console.log(`[SCHEDULER] Processing store ${store.id}`)
        
        // Check if we have data for yesterday first, then try the most recent data
        let dailyData = null
        let actualReportDate = reportDate

        // Try yesterday's data first
        const { data: yesterdayData, error: yesterdayError } = await supabase
          .from('daily_data')
          .select('*')
          .eq('store_id', store.id)
          .eq('data_date', reportDate)
          .single()

        if (!yesterdayError && yesterdayData) {
          dailyData = yesterdayData
        } else {
          // If no yesterday data, get the most recent data
          console.log(`[SCHEDULER] No data found for ${reportDate}, looking for most recent data`)
          const { data: recentData, error: recentError } = await supabase
            .from('daily_data')
            .select('*')
            .eq('store_id', store.id)
            .order('data_date', { ascending: false })
            .limit(1)
            .single()

          if (!recentError && recentData) {
            dailyData = recentData
            actualReportDate = recentData.data_date
            console.log(`[SCHEDULER] Using recent data from ${actualReportDate} for store ${store.id}`)
          }
        }

        if (!dailyData) {
          console.log(`[SCHEDULER] No data found for ${store.id}`)
          results.push({
            store: store.id,
            recipient: user.email!,
            success: false,
            error: `No data found for this store`
          })
          continue
        }

        // For CEO role, get all stores data and add banking information
        let allStoresData = null
        if (user.email === 'beaum045@umn.edu') { // CEO access
          const { data: allData, error: allDataError } = await supabase
            .from('daily_data')
            .select('*')
            .eq('data_date', actualReportDate)
            
          if (!allDataError && allData) {
            allStoresData = allData
          }
        }

        // Generate AI report for CEO (highest level access)
        const reportContent = await generateAIReport(dailyData, store, actualReportDate, 'ceo', allStoresData)
        
        try {
          const emailResult = await sendReportEmail({
            to: user.email!,
            recipientName: user.user_metadata?.full_name || 'CEO',
            storeName: store.name,
            storeLocation: store.address,
            reportDate: actualReportDate,
            reportRole: 'ceo',
            reportContent,
          })

          if (emailResult.success) {
            console.log(`[SCHEDULER] Email sent to ${user.email}`)
            
            // Log the delivery (only if supabase has proper client)
            if ('from' in supabase) {
              await supabase.from('delivery_logs').insert({
                report_id: null, // We don't have a report_id for auto-generated reports
                delivery_method: 'email',
                recipients: [user.email!],
                status: 'sent',
                sent_at: new Date().toISOString(),
              })
            }
          } else {
            console.error(`[SCHEDULER] Failed to send email to ${user.email}:`, emailResult.error)
          }

          results.push({
            store: store.id,
            recipient: user.email,
            success: emailResult.success,
            error: emailResult.error
          })

        } catch (emailError: any) {
          console.error(`[SCHEDULER] Email error for ${user.email}:`, emailError)
          results.push({
            store: store.id,
            recipient: user.email!,
            success: false,
            error: emailError?.message || 'Email error'
          })
        }

      } catch (storeError: any) {
        console.error(`[SCHEDULER] Error processing store ${store.id}:`, storeError)
        results.push({
          store: store.id,
          success: false,
          error: storeError?.message || 'Store processing error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    console.log(`[SCHEDULER] Completed: ${successCount}/${totalCount} emails sent successfully`)
    
    return {
      success: true,
      message: `Daily email process completed: ${successCount}/${totalCount} emails sent`,
      results
    }

  } catch (error: any) {
    console.error('[SCHEDULER] Daily email process failed:', error)
    return { success: false, error: error?.message || 'Unknown error' }
  }
}

async function generateAIReport(dailyData: any, store: any, reportDate: string, role: string, allStoresData?: any[]): Promise<string> {
  try {
    const systemPrompt = getSystemPromptForRole(role)
    const dataPrompt = createDataPrompt(dailyData, store, reportDate, role, allStoresData)

    const result = await streamText({
      model: xai("grok-beta"),
      prompt: dataPrompt,
      system: systemPrompt,
    })

    // Convert stream to text
    let content = ''
    for await (const chunk of result.textStream) {
      content += chunk
    }

    return content

  } catch (error) {
    console.error('Error generating AI report:', error)
    return `Daily Report for ${store.name} - ${reportDate}

**Sales Performance:**
- Total Sales: $${dailyData.total_sales}
- Transactions: ${dailyData.transaction_count}
- Average Ticket: $${dailyData.average_ticket || 'N/A'}

**Labor Metrics:**
- Labor Hours: ${dailyData.labor_hours}
- Labor Cost: $${dailyData.labor_cost}
- Labor %: ${dailyData.labor_percentage || 'N/A'}%

**Food Cost:**
- Food Cost: $${dailyData.food_cost}
- Food %: ${dailyData.food_cost_percentage || 'N/A'}%

This report was automatically generated. Please contact your manager if you need additional details.`
  }
}

function getSystemPromptForRole(role: string): string {
  const basePrompt = "You are an AI assistant specialized in analyzing Dairy Queen restaurant operations. Provide clear, actionable insights based on the daily performance data. Keep the report concise and professional for email delivery."

  switch (role) {
    case "store_manager_single":
      return `${basePrompt} Focus on single-store operations: staff performance, inventory management, customer service, daily operational efficiency, and immediate actionable improvements. Provide specific recommendations for store-level optimization.`
    case "store_manager_multiple":
      return `${basePrompt} Focus on multi-location management: comparative performance across stores, resource allocation, staffing optimization, inventory coordination, and regional trends. Identify best practices to share between locations and areas needing attention.`
    case "ceo":
      return `${basePrompt} Provide executive-level analysis including: high-level business metrics, profitability analysis, strategic trends across all locations, competitive positioning, financial performance indicators, growth opportunities, and strategic recommendations. Include banking/financial aspects like cash flow, profit margins, and investment opportunities.`
    default:
      return basePrompt
  }
}

function createDataPrompt(dailyData: any, store: any, reportDate: string, role?: string, allStoresData?: any[]): string {
  let baseData = `**Primary Store Data - ${store.name} (${reportDate}):**
- Total Sales: $${dailyData.total_sales}
- Transaction Count: ${dailyData.transaction_count}
- Average Ticket: $${dailyData.average_ticket || 'N/A'}
- Labor Hours: ${dailyData.labor_hours}
- Labor Cost: $${dailyData.labor_cost}
- Labor Percentage: ${dailyData.labor_percentage || 'N/A'}%
- Food Cost: $${dailyData.food_cost}
- Food Percentage: ${dailyData.food_cost_percentage || 'N/A'}%
- Customer Count: ${dailyData.customer_count}
- Drive Thru Time: ${dailyData.drive_thru_time || 'N/A'} seconds
- Order Accuracy: ${dailyData.order_accuracy || 'N/A'}%`

  // Add multi-store data for CEO
  if (role === 'ceo' && allStoresData && allStoresData.length > 1) {
    const totalSales = allStoresData.reduce((sum, store) => sum + (store.total_sales || 0), 0)
    const totalTransactions = allStoresData.reduce((sum, store) => sum + (store.transaction_count || 0), 0)
    const totalLaborCost = allStoresData.reduce((sum, store) => sum + (store.labor_cost || 0), 0)
    const totalFoodCost = allStoresData.reduce((sum, store) => sum + (store.food_cost || 0), 0)
    
    baseData += `

**CEO Multi-Location Summary (${reportDate}):**
- Total Network Sales: $${totalSales.toFixed(2)}
- Total Transactions: ${totalTransactions}
- Network Average Ticket: $${totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : 'N/A'}
- Total Labor Cost: $${totalLaborCost.toFixed(2)}
- Network Labor %: ${totalSales > 0 ? ((totalLaborCost / totalSales) * 100).toFixed(1) : 'N/A'}%
- Total Food Cost: $${totalFoodCost.toFixed(2)}
- Network Food %: ${totalSales > 0 ? ((totalFoodCost / totalSales) * 100).toFixed(1) : 'N/A'}%

**Individual Store Performance:**`
    
    allStoresData.forEach(storeData => {
      baseData += `
- ${storeData.store_id}: $${storeData.total_sales || 0} sales, ${storeData.transaction_count || 0} transactions (${storeData.labor_percentage || 'N/A'}% labor)`
    })
    
    // Add banking/financial data for CEO
    const netProfit = totalSales - totalLaborCost - totalFoodCost
    const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100) : 0
    
    baseData += `

**Financial/Banking Analysis:**
- Gross Revenue: $${totalSales.toFixed(2)}
- Operating Costs: $${(totalLaborCost + totalFoodCost).toFixed(2)}
- Net Operating Profit: $${netProfit.toFixed(2)}
- Profit Margin: ${profitMargin.toFixed(1)}%
- Cash Flow Status: ${netProfit > 0 ? 'Positive' : 'Needs Attention'}
- Investment Opportunities: ${profitMargin > 15 ? 'Consider expansion' : 'Focus on efficiency'}`
  }

  return `Generate a comprehensive report based on the following data:

${baseData}

**Requirements:**
1. Tailor the report for ${role?.replace('_', ' ') || 'management'} level
2. ${role === 'ceo' ? 'Focus on strategic insights, financial performance, and growth opportunities' : role === 'store_manager_multiple' ? 'Compare store performance and identify optimization opportunities' : 'Focus on operational efficiency and immediate improvements'}
3. Provide 3-4 key insights and actionable recommendations
4. Use professional tone with clear sections
5. Keep under 400 words for email readability
6. Include relevant metrics and percentages

Format with clear headings and bullet points for easy reading.`
}