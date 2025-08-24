import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      to, 
      reportSections, 
      scheduledTime, 
      userEmail,
      userName 
    } = body

    // Generate email HTML content
    const generateEmailHTML = (sections: any[], time: string, name: string) => {
      const sectionsHTML = sections.map(section => {
        const mockMetrics = {
          'pos-sales': { title: 'Daily Sales Performance', value: '$24,850', trend: '+12.5%', icon: '💳' },
          'inventory': { title: 'Inventory Status', value: '94%', trend: '+2.1%', icon: '📊' },
          'customer-data': { title: 'Customer Satisfaction', value: '4.3/5', trend: '+0.2', icon: '👥' },
          'financial': { title: 'Financial Health', value: '$18,200', trend: '+8.7%', icon: '💰' },
          'performance': { title: 'Performance KPIs', value: '87%', trend: '-1.2%', icon: '📈' },
          'labor-data': { title: 'Labor Analytics', value: '18.5%', trend: '-0.8%', icon: '📋' }
        }
        
        const metric = mockMetrics[section.dataSource.id as keyof typeof mockMetrics]
        
        return `
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <span style="font-size: 24px;">${metric?.icon || '📊'}</span>
              <h3 style="margin: 0; color: #1a202c; font-size: 18px;">${metric?.title || section.dataSource.name}</h3>
            </div>
            <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">Powered by ${section.dataSource.company}</p>
            <div style="display: flex; gap: 20px; align-items: center;">
              <div>
                <div style="font-size: 24px; font-weight: bold; color: #1a202c;">${metric?.value || 'Loading...'}</div>
                <div style="font-size: 12px; color: #718096;">Current value</div>
              </div>
              <div>
                <div style="color: #10b981; font-weight: 600;">${metric?.trend || '+0%'}</div>
                <div style="font-size: 12px; color: #718096;">vs yesterday</div>
              </div>
            </div>
          </div>
        `
      }).join('')

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Daily AI Report</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px 40px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Daily AI Report</h1>
                  <p style="margin: 5px 0 0 0; color: #bfdbfe;">Dairy Queen Dashboard</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; font-size: 14px; color: #bfdbfe;">Generated at ${time}</p>
                  <p style="margin: 0; font-size: 14px; color: #bfdbfe;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div style="padding: 30px 40px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <h2 style="margin: 0 0 10px 0; color: #1a202c; font-size: 18px;">Executive Summary</h2>
              <p style="margin: 0; color: #4a5568; line-height: 1.5;">
                Hi ${name}, your automated daily report includes ${sections.length} key data insights 
                across your selected business metrics. All data is current as of this morning.
              </p>
            </div>

            <!-- Report Content -->
            <div style="padding: 30px 40px;">
              ${sections.length === 0 ? 
                '<p style="text-align: center; color: #718096; padding: 40px 0;">No data sources selected for this report.</p>' : 
                sectionsHTML
              }
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                  <p style="margin: 0; font-size: 14px; color: #4a5568;">
                    This report was automatically generated by your DQ AI Dashboard
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #718096;">
                    Scheduled for ${time} daily
                  </p>
                </div>
                <div style="background-color: #e2e8f0; color: #4a5568; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                  AI Generated
                </div>
              </div>
              <div style="text-align: center; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 12px; color: #a0aec0;">
                  © 2024 Dairy Queen Dashboard | Powered by AI Analytics
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const emailHTML = generateEmailHTML(reportSections, scheduledTime, userName || 'User')

    const { data, error } = await resend.emails.send({
      from: 'DQ Dashboard <onboarding@resend.dev>',
      to: ['beaum045@umn.edu'], // Testing with UMN email
      subject: `Daily AI Report - ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      html: emailHTML,
    })

    if (error) {
      console.error('Resend Error Details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { success: false, error: `Failed to send email: ${error.message || error}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      message: 'Report email sent successfully'
    })

  } catch (error) {
    console.error('Email Send Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send report email' },
      { status: 500 }
    )
  }
}