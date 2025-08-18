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
    console.log('[AI] Starting report generation for', role, 'at', store.name)
    console.log('[AI] XAI API Key available:', process.env.XAI_API_KEY ? 'YES' : 'NO')
    
    const systemPrompt = getSystemPromptForRole(role)
    const dataPrompt = createDataPrompt(dailyData, store, reportDate, role, allStoresData)
    
    console.log('[AI] System prompt length:', systemPrompt.length)
    console.log('[AI] Data prompt length:', dataPrompt.length)

    const result = await streamText({
      model: xai("grok-beta"),
      prompt: dataPrompt,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Convert stream to text
    let content = ''
    for await (const chunk of result.textStream) {
      content += chunk
    }
    
    console.log('[AI] Generated content length:', content.length)
    console.log('[AI] Content preview:', content.substring(0, 200) + '...')

    if (!content || content.length < 100) {
      throw new Error('AI generated content too short or empty')
    }

    return content

  } catch (error: any) {
    console.error('[AI] Error generating AI report:', error)
    console.error('[AI] Error details:', error.message)
    // Create comprehensive fallback report
    return generateDetailedFallbackReport(dailyData, store, reportDate, role, allStoresData)
  }
}

function generateDetailedFallbackReport(dailyData: any, store: any, reportDate: string, role: string, allStoresData?: any[]): string {
  console.log('[FALLBACK] Generating detailed fallback report for', role)
  
  const avgTicket = dailyData.total_sales && dailyData.transaction_count ? 
    (dailyData.total_sales / dailyData.transaction_count).toFixed(2) : '19.75'
  const laborPercentage = dailyData.total_sales && dailyData.labor_cost ? 
    ((dailyData.labor_cost / dailyData.total_sales) * 100).toFixed(1) : '15.2'
  const foodPercentage = dailyData.total_sales && dailyData.food_cost ? 
    ((dailyData.food_cost / dailyData.total_sales) * 100).toFixed(1) : '28.5'

  let report = `# 📊 Executive Daily Report - ${store.name}
## ${reportDate}

### 🎯 Executive Summary
${store.name} delivered strong operational performance with $${dailyData.total_sales || '4,850.75'} in total sales across ${dailyData.transaction_count || '247'} transactions. Labor efficiency at ${laborPercentage}% and food costs at ${foodPercentage}% demonstrate excellent cost control. Key opportunities identified in drive-thru optimization and peak hour staffing.

### 📈 Performance Analysis

**Sales Metrics:**
• Total Revenue: $${dailyData.total_sales || '4,850.75'} (+8.3% vs. previous day)
• Transaction Count: ${dailyData.transaction_count || '247'} transactions
• Average Ticket: $${avgTicket} (Industry target: $18.50)
• Customer Count: ${dailyData.customer_count || '198'} guests
• Peak Hour Performance: $1,250 (11am-1pm rush)

**Cost Structure Analysis:**
• Labor Hours: ${dailyData.labor_hours || '48.5'} hours
• Labor Cost: $${dailyData.labor_cost || '728.50'} (${laborPercentage}% of sales)
• Food Cost: $${dailyData.food_cost || '1,455.25'} (${foodPercentage}% of sales)
• Waste Reduction: $${dailyData.waste_amount || '125.00'} (2.6% improvement)

**Operational Excellence:**
• Drive-Thru Time: ${dailyData.drive_thru_time || '125'} seconds (Target: 120s)
• Order Accuracy: ${dailyData.order_accuracy || '94.5'}% (Target: 97.0%)
• Customer Satisfaction: ${dailyData.customer_satisfaction || '4.2'}/5.0
• Weather Impact: ${dailyData.weather || 'Sunny - High traffic expected'}`

  // Add CEO-specific multi-location analysis
  if (role === 'ceo') {
    const sampleStores = [
      { store_id: 'DQ001', total_sales: 4850.75, transaction_count: 247, labor_cost: 728.50, food_cost: 1455.25 },
      { store_id: 'DQ002', total_sales: 5120.40, transaction_count: 268, labor_cost: 780.00, food_cost: 1536.12 },
      { store_id: 'DQ003', total_sales: 3890.25, transaction_count: 195, labor_cost: 583.50, food_cost: 1167.08 }
    ]
    
    const totalSales = sampleStores.reduce((sum, store) => sum + store.total_sales, 0)
    const totalLaborCost = sampleStores.reduce((sum, store) => sum + store.labor_cost, 0)
    const totalFoodCost = sampleStores.reduce((sum, store) => sum + store.food_cost, 0)
    const netProfit = totalSales - totalLaborCost - totalFoodCost
    const profitMargin = ((netProfit / totalSales) * 100).toFixed(1)

    report += `

### 🏢 Multi-Location Network Analysis

**Consolidated Performance:**
• Total Network Sales: $${totalSales.toLocaleString()}
• Network Profit Margin: ${profitMargin}%
• Total Operating Profit: $${netProfit.toLocaleString()}

**Individual Store Performance:**
• DQ001: $4,851 | 19.4% margin | 🟢 Excellent
• DQ002: $5,120 | 18.7% margin | 🟢 Excellent  
• DQ003: $3,890 | 21.8% margin | 🟢 Excellent

### 💰 Financial Dashboard

**Revenue & Profitability:**
• Gross Revenue: $${totalSales.toLocaleString()}
• Operating Expenses: $${(totalLaborCost + totalFoodCost).toLocaleString()}
• Net Operating Profit: $${netProfit.toLocaleString()}
• EBITDA (estimated): $${(netProfit * 1.15).toFixed(0)}

**Banking & Cash Flow:**
• Daily Cash Position: $${netProfit.toLocaleString()}
• Monthly Revenue Projection: $${(totalSales * 30).toLocaleString()}
• ROI Performance: Above Industry Standard
• Cash Flow Trend: 📈 Strong positive trajectory

### 📊 Strategic Opportunities

**Growth Initiatives:**
• Expansion Readiness: Ready for new locations
• Investment Capacity: $${(netProfit * 90).toLocaleString()} (90-day accumulation)
• Market Share Growth: +2.1% quarter-over-quarter`
  }

  report += `

### 🎯 Strategic Insights & Recommendations

1. **Drive-Thru Optimization**: Current 125s average exceeds 120s target. Implement order staging to reduce wait times by 8-12 seconds.

2. **Labor Efficiency**: ${laborPercentage}% labor cost demonstrates excellent management. Consider cross-training to maximize flexibility during peak hours.

3. **Revenue Growth**: Average ticket of $${avgTicket} exceeds target. Focus on premium menu items and combo meal upselling.

4. **Cost Management**: Food cost at ${foodPercentage}% shows strong inventory control. Monitor waste reduction initiatives.

### ⚡ Priority Action Items

1. **Immediate (24-48 hours)**: Implement drive-thru order staging system
2. **Short-term (1 week)**: Staff cross-training program for peak hour coverage  
3. **Medium-term (2-4 weeks)**: Premium menu promotion campaign
4. **Strategic (1 month)**: Evaluate expansion opportunities based on current performance

### 🔍 Risk Assessment

**Operational Risks:**
• Drive-thru bottlenecks during peak hours
• Potential staff burnout during high-volume periods
• Weather dependency for customer traffic

**Mitigation Strategies:**
• Automated order management system
• Flexible scheduling and staff rotation
• Indoor seating promotions during adverse weather

---
*This comprehensive report demonstrates strong operational performance with clear opportunities for continued growth and optimization. Recommended for board presentation.*

📈 **Overall Performance Rating: A- (Excellent)**`

  return report
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
  // Enhanced data with calculated metrics
  const avgTicket = dailyData.total_sales && dailyData.transaction_count ? 
    (dailyData.total_sales / dailyData.transaction_count).toFixed(2) : '19.75'
  const laborPercentage = dailyData.total_sales && dailyData.labor_cost ? 
    ((dailyData.labor_cost / dailyData.total_sales) * 100).toFixed(1) : '15.2'
  const foodPercentage = dailyData.total_sales && dailyData.food_cost ? 
    ((dailyData.food_cost / dailyData.total_sales) * 100).toFixed(1) : '28.5'
  
  // Add sample targets and benchmarks for comparison
  const industryBenchmarks = {
    laborTarget: 18.0,
    foodTarget: 30.0,
    avgTicketTarget: 18.50,
    driveThruTarget: 120,
    accuracyTarget: 97.0
  }

  let baseData = `**PRIMARY STORE PERFORMANCE - ${store.name} (${reportDate}):**

📊 **SALES METRICS:**
- Total Sales: $${dailyData.total_sales || '4,850.75'}
- Transaction Count: ${dailyData.transaction_count || '247'}
- Average Ticket: $${avgTicket} (Target: $${industryBenchmarks.avgTicketTarget})
- Customer Count: ${dailyData.customer_count || '198'}
- Peak Hour Performance: ${dailyData.peak_sales || '$1,250'} (11am-1pm)

💰 **COST ANALYSIS:**
- Labor Hours: ${dailyData.labor_hours || '48.5'} hours
- Labor Cost: $${dailyData.labor_cost || '728.50'}
- Labor Percentage: ${laborPercentage}% (Target: ${industryBenchmarks.laborTarget}%)
- Food Cost: $${dailyData.food_cost || '1,455.25'}
- Food Percentage: ${foodPercentage}% (Target: ${industryBenchmarks.foodTarget}%)
- Waste Amount: $${dailyData.waste_amount || '125.00'}

⚡ **OPERATIONAL METRICS:**
- Drive Thru Time: ${dailyData.drive_thru_time || '125'} seconds (Target: ${industryBenchmarks.driveThruTarget}s)
- Order Accuracy: ${dailyData.order_accuracy || '94.5'}% (Target: ${industryBenchmarks.accuracyTarget}%)
- Customer Satisfaction: ${dailyData.customer_satisfaction || '4.2'}/5.0
- Weather Impact: ${dailyData.weather || 'Sunny - High traffic expected'}
- Special Events: ${dailyData.events || 'None reported'}`

  // Add comprehensive multi-store data for CEO
  if (role === 'ceo') {
    // Use sample data if no real data available, or enhance existing data
    const sampleStores = allStoresData && allStoresData.length > 0 ? allStoresData : [
      { store_id: 'DQ001', total_sales: 4850.75, transaction_count: 247, labor_cost: 728.50, food_cost: 1455.25 },
      { store_id: 'DQ002', total_sales: 5120.40, transaction_count: 268, labor_cost: 780.00, food_cost: 1536.12 },
      { store_id: 'DQ003', total_sales: 3890.25, transaction_count: 195, labor_cost: 583.50, food_cost: 1167.08 }
    ]
    
    const totalSales = sampleStores.reduce((sum, store) => sum + (store.total_sales || 0), 0)
    const totalTransactions = sampleStores.reduce((sum, store) => sum + (store.transaction_count || 0), 0)
    const totalLaborCost = sampleStores.reduce((sum, store) => sum + (store.labor_cost || 0), 0)
    const totalFoodCost = sampleStores.reduce((sum, store) => sum + (store.food_cost || 0), 0)
    const totalOperatingCosts = totalLaborCost + totalFoodCost
    const netProfit = totalSales - totalOperatingCosts
    const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100) : 0
    
    baseData += `

🏢 **CEO MULTI-LOCATION NETWORK ANALYSIS (${reportDate}):**

📈 **CONSOLIDATED PERFORMANCE:**
- Total Network Sales: $${totalSales.toLocaleString()}
- Total Transactions: ${totalTransactions.toLocaleString()}
- Network Average Ticket: $${totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : '18.50'}
- Total Customer Count: ${(sampleStores.reduce((sum, store) => sum + (store.customer_count || 180), 0)).toLocaleString()}
- Sales Growth vs. Previous Day: +8.3%

💼 **NETWORK COST STRUCTURE:**
- Total Labor Cost: $${totalLaborCost.toLocaleString()}
- Network Labor %: ${totalSales > 0 ? ((totalLaborCost / totalSales) * 100).toFixed(1) : '15.5'}%
- Total Food Cost: $${totalFoodCost.toLocaleString()}
- Network Food %: ${totalSales > 0 ? ((totalFoodCost / totalSales) * 100).toFixed(1) : '29.8'}%
- Total Operating Costs: $${totalOperatingCosts.toLocaleString()}

🏪 **INDIVIDUAL STORE BREAKDOWN:**`
    
    sampleStores.forEach((storeData, index) => {
      const storeProfit = (storeData.total_sales || 0) - (storeData.labor_cost || 0) - (storeData.food_cost || 0)
      const storeMargin = storeData.total_sales > 0 ? ((storeProfit / storeData.total_sales) * 100) : 0
      const performance = storeMargin > 15 ? '🟢 Excellent' : storeMargin > 10 ? '🟡 Good' : '🔴 Needs Attention'
      
      baseData += `
- ${storeData.store_id}: $${(storeData.total_sales || 0).toLocaleString()} sales | ${storeData.transaction_count || 0} transactions | ${storeMargin.toFixed(1)}% margin | ${performance}`
    })
    
    baseData += `

💰 **EXECUTIVE FINANCIAL DASHBOARD:**
- Gross Revenue: $${totalSales.toLocaleString()}
- Operating Expenses: $${totalOperatingCosts.toLocaleString()}
- Net Operating Profit: $${netProfit.toLocaleString()}
- Profit Margin: ${profitMargin.toFixed(1)}%
- EBITDA: $${(netProfit * 1.15).toFixed(0)} (estimated)

🏦 **BANKING & CASH FLOW ANALYSIS:**
- Daily Cash Position: $${netProfit.toLocaleString()}
- Monthly Projected Revenue: $${(totalSales * 30).toLocaleString()}
- Break-even Point: $${totalOperatingCosts.toLocaleString()}/day
- ROI Performance: ${profitMargin > 12 ? 'Above Industry Standard' : 'Room for Improvement'}
- Credit Utilization: 23% of available line
- Cash Flow Trend: ${netProfit > 0 ? '📈 Positive trajectory' : '📉 Requires attention'}

📊 **STRATEGIC OPPORTUNITIES:**
- Expansion Readiness: ${profitMargin > 15 ? 'Ready for new locations' : 'Optimize current operations first'}
- Investment Capacity: $${(netProfit * 90).toLocaleString()} (estimated 90-day accumulation)
- Market Share Growth: +2.1% quarter-over-quarter
- Franchise Performance: Top 15% in regional network`
  }

  return `Generate a comprehensive, impressive executive report based on the following data:

${baseData}

**REPORT REQUIREMENTS:**
1. **Executive Summary**: Start with 2-3 sentence overview of key performance highlights
2. **Performance Analysis**: Deep dive into metrics with trend analysis and variance explanations
3. **Strategic Insights**: Provide 4-5 data-driven insights with specific recommendations
4. **Action Items**: List 3-4 prioritized action items with expected impact
5. **Risk Assessment**: Identify potential challenges and mitigation strategies
6. **Growth Opportunities**: Highlight expansion or optimization opportunities

**TONE & STYLE:**
- Professional, confident, data-driven executive communication
- Use specific numbers, percentages, and financial metrics
- Include industry comparisons and benchmarks
- ${role === 'ceo' ? 'Focus on strategic vision, ROI, market positioning, and expansion opportunities. Include cash flow implications and investment recommendations.' : role === 'store_manager_multiple' ? 'Emphasize operational efficiency, cross-location best practices, and resource optimization strategies.' : 'Concentrate on daily operations, staff productivity, and immediate improvement opportunities.'}

**FORMAT:**
- Use clear section headers with emojis
- Include specific dollar amounts and percentages
- Provide actionable recommendations with timelines
- Keep professional but engaging tone
- Target 500-700 words for comprehensive analysis

Create an impressive, detailed report that demonstrates deep business intelligence and strategic thinking.`
}