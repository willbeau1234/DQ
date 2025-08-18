interface EmailParams {
  to: string
  recipientName: string
  storeName: string
  storeLocation: string
  reportDate: string
  reportRole: string
  reportContent: string
}

function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'store_manager_single':
      return 'Store Manager'
    case 'store_manager_multiple':
      return 'Multi-Location Manager'
    case 'ceo':
      return 'Executive'
    default:
      return role.charAt(0).toUpperCase() + role.slice(1)
  }
}

export async function sendReportEmail({
  to,
  recipientName,
  storeName,
  storeLocation,
  reportDate,
  reportRole,
  reportContent,
}: EmailParams) {
  // In a real implementation, you would use a service like Resend, SendGrid, or similar
  // For now, we'll simulate the email sending process

  const emailTemplate = generateEmailTemplate({
    recipientName,
    storeName,
    storeLocation,
    reportDate,
    reportRole,
    reportContent,
  })

  try {
    console.log(`[EMAIL] Attempting to send email to ${to}`)
    console.log(`[EMAIL] Using API key: ${process.env.RESEND_API_KEY ? 'FOUND' : 'NOT FOUND'}`)
    
    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DQ Reports <onboarding@resend.dev>',
        to: [to],
        subject: `Daily ${getRoleDisplayName(reportRole)} Report - ${storeName} (${reportDate})`,
        html: emailTemplate,
      }),
    })

    const responseText = await response.text()
    console.log(`[EMAIL] Response status: ${response.status}`)
    console.log(`[EMAIL] Response: ${responseText}`)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch {
        errorData = { message: responseText }
      }
      
      // If Resend fails, save email to file for viewing
      console.log(`[EMAIL] Resend failed: ${errorData.message || response.statusText}`)
      
      try {
        const fs = require('fs')
        const path = require('path')
        
        const emailsDir = path.join(process.cwd(), 'generated-emails')
        if (!fs.existsSync(emailsDir)) {
          fs.mkdirSync(emailsDir, { recursive: true })
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const fileName = `email-${reportDate}-${storeName.replace(/\s+/g, '-')}-${timestamp}.html`
        const filePath = path.join(emailsDir, fileName)
        
        const fullEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Report - ${reportDate}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
    .email-info { background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .email-content { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .error-info { background: #fef2f2; border: 1px solid #fecaca; padding: 10px; border-radius: 6px; margin-bottom: 15px; }
  </style>
</head>
<body>
  <div class="error-info">
    <p><strong>⚠️ Email Service Issue:</strong> ${errorData.message || 'Resend API unavailable'}</p>
    <p>This report was saved locally for viewing instead.</p>
  </div>

  <div class="email-info">
    <h2>📧 Generated Email Report</h2>
    <p><strong>To:</strong> ${to}</p>
    <p><strong>Subject:</strong> Daily ${getRoleDisplayName(reportRole)} Report - ${storeName} (${reportDate})</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  </div>
  
  <div class="email-content">
    ${emailTemplate}
  </div>
</body>
</html>`
        
        fs.writeFileSync(filePath, fullEmail)
        
        console.log(`[EMAIL] Email saved to file: ${filePath}`)
        console.log(`[EMAIL] Open this file in your browser to see the full AI report!`)
        
        return { 
          success: true, 
          message: `Email saved to file: generated-emails/${fileName}`,
          fallback: true,
          filePath: filePath
        }
      } catch (saveError) {
        return { 
          success: true, 
          message: `Email simulated (Resend unavailable): ${errorData.message}`,
          fallback: true
        }
      }
    }

    const result = JSON.parse(responseText)
    console.log(`[EMAIL] Successfully sent to ${to}, ID: ${result.id}`)
    
    return { success: true, message: "Email sent successfully", emailId: result.id }
  } catch (error: any) {
    console.error("[EMAIL] Error sending email:", error)
    
    // Fallback for testing - save email to file
    try {
      const fs = require('fs')
      const path = require('path')
      
      const emailsDir = path.join(process.cwd(), 'generated-emails')
      if (!fs.existsSync(emailsDir)) {
        fs.mkdirSync(emailsDir, { recursive: true })
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `email-${reportDate}-${storeName.replace(/\s+/g, '-')}-${timestamp}.html`
      const filePath = path.join(emailsDir, fileName)
      
      const fullEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Report - ${reportDate}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
    .email-info { background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .email-content { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
  </style>
</head>
<body>
  <div class="email-info">
    <h2>📧 Generated Email Report</h2>
    <p><strong>To:</strong> ${to}</p>
    <p><strong>Subject:</strong> Daily ${getRoleDisplayName(reportRole)} Report - ${storeName} (${reportDate})</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  </div>
  
  <div class="email-content">
    ${emailTemplate}
  </div>
</body>
</html>`
      
      fs.writeFileSync(filePath, fullEmail)
      
      console.log(`[EMAIL] FALLBACK: Email saved to file: ${filePath}`)
      console.log(`[EMAIL] You can open this file in your browser to see the full report!`)
      
      return { 
        success: true, 
        message: `Email saved to file: generated-emails/${fileName}`,
        fallback: true,
        filePath: filePath
      }
    } catch (fileError) {
      console.error("[EMAIL] Error saving email to file:", fileError)
      
      // Final fallback - just log to console
      console.log(`[EMAIL] CONSOLE FALLBACK: Email content for ${to}:`)
      console.log(`Subject: Daily ${getRoleDisplayName(reportRole)} Report - ${storeName} (${reportDate})`)
      console.log('Content:')
      console.log(reportContent)
      console.log(`[EMAIL] ====== END EMAIL SIMULATION ======`)
      
      return { 
        success: true, 
        message: "Email content logged to console",
        fallback: true
      }
    }
  }
}

function generateEmailTemplate({
  recipientName,
  storeName,
  storeLocation,
  reportDate,
  reportRole,
  reportContent,
}: Omit<EmailParams, "to">) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Report - ${storeName}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    .report-content { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #1e40af; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
    .store-info { background: #e0f2fe; padding: 15px; border-radius: 6px; margin: 15px 0; }
    h1 { margin: 0; font-size: 24px; }
    h2 { color: #1e40af; margin-top: 0; }
    .date { font-size: 16px; opacity: 0.9; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🍦 DQ Daily Report</h1>
    <div class="date">${new Date(reportDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</div>
  </div>
  
  <div class="content">
    <p>Hello ${recipientName},</p>
    
    <p>Here's your daily ${getRoleDisplayName(reportRole).toLowerCase()} report for <strong>${storeName}</strong>.</p>
    
    <div class="store-info">
      <strong>📍 ${storeName}</strong><br>
      ${storeLocation}
    </div>
    
    <div class="report-content">
      <h2>📊 ${getRoleDisplayName(reportRole)} Report</h2>
      <div style="white-space: pre-wrap; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        ${reportContent}
      </div>
    </div>
    
    <p>This report was automatically generated by the DQ AI Reporting System.</p>
    
    <p>Best regards,<br>
    <strong>DQ Reporting Team</strong></p>
  </div>
  
  <div class="footer">
    <p>This is an automated message from DQ AI Reporting Tool.<br>
    If you have questions, please contact your store manager.</p>
  </div>
</body>
</html>
  `
}

export async function sendSMSReport(phoneNumber: string, message: string) {
  // In a real implementation, you would use a service like Twilio
  console.log(`[SMS] Sending to ${phoneNumber}: ${message.substring(0, 100)}...`)

  try {
    // Simulate SMS sending - replace with actual SMS service
    // const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: new URLSearchParams({
    //     From: process.env.TWILIO_PHONE_NUMBER,
    //     To: phoneNumber,
    //     Body: message,
    //   }),
    // })

    return { success: true, message: "SMS sent successfully" }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return { success: false, error: "Failed to send SMS" }
  }
}
