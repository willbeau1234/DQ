import { NextRequest, NextResponse } from 'next/server'
import { sendDailyReports } from '@/lib/daily-email-scheduler'

export async function POST(request: NextRequest) {
  try {
    const { testMode } = await request.json()
    
    console.log('[TEST] Manual email trigger started at:', new Date().toISOString())
    
    // Run the daily email process
    const result = await sendDailyReports()
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString(),
      results: result.results || [],
      testMode: testMode || false
    })

  } catch (error) {
    console.error('[TEST] Manual email trigger error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}