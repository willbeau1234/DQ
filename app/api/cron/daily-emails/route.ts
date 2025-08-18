import { NextRequest, NextResponse } from 'next/server'
import { sendDailyReports } from '@/lib/daily-email-scheduler'

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron service (optional security)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[CRON] Daily email job triggered at:', new Date().toISOString())
    
    // Run the daily email process
    const result = await sendDailyReports()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
        results: result.results
      })
    } else {
      console.error('[CRON] Daily email job failed:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

  } catch (error) {
    console.error('[CRON] Daily email job error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Allow POST requests as well for flexibility with different cron services
  return GET(request)
}