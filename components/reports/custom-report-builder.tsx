"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock, Mail, Smartphone, Folder, Building2, BarChart3, PieChart, TrendingUp, Users, DollarSign } from "lucide-react"
import { EmailReportTemplate } from "./email-report-template"

interface DataSource {
  id: string
  name: string
  company: string
  logo: React.ReactNode
  color: string
}

interface ReportSection {
  id: string
  name: string
  type: 'chart' | 'metric' | 'table'
  dataSource: DataSource
}

export function CustomReportBuilder() {
  const { user } = useAuth()
  const [selectedTime, setSelectedTime] = useState("9:00 AM")
  const [reportSections, setReportSections] = useState<ReportSection[]>([])
  const [draggedItem, setDraggedItem] = useState<DataSource | null>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const dataSources: DataSource[] = [
    {
      id: 'pos-sales',
      name: 'POS Sales Data',
      company: 'SquareUp Systems',
      logo: <Building2 className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-100 border-blue-300'
    },
    {
      id: 'inventory',
      name: 'Inventory Tracking',
      company: 'StockPro Analytics',
      logo: <BarChart3 className="h-8 w-8 text-green-600" />,
      color: 'bg-green-100 border-green-300'
    },
    {
      id: 'customer-data',
      name: 'Customer Analytics',
      company: 'CustomerIQ',
      logo: <Users className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-100 border-purple-300'
    },
    {
      id: 'financial',
      name: 'Financial Metrics',
      company: 'FinanceFlow',
      logo: <DollarSign className="h-8 w-8 text-orange-600" />,
      color: 'bg-orange-100 border-orange-300'
    },
    {
      id: 'performance',
      name: 'Performance KPIs',
      company: 'MetricsPro',
      logo: <TrendingUp className="h-8 w-8 text-red-600" />,
      color: 'bg-red-100 border-red-300'
    },
    {
      id: 'labor-data',
      name: 'Labor Analytics',
      company: 'WorkForce Insights',
      logo: <PieChart className="h-8 w-8 text-indigo-600" />,
      color: 'bg-indigo-100 border-indigo-300'
    }
  ]

  const timeOptions = [
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ]

  const handleDragStart = useCallback((dataSource: DataSource) => {
    setDraggedItem(dataSource)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem) {
      const newSection: ReportSection = {
        id: `section-${Date.now()}`,
        name: draggedItem.name,
        type: 'chart',
        dataSource: draggedItem
      }
      setReportSections(prev => [...prev, newSection])
      setDraggedItem(null)
    }
  }, [draggedItem])

  const removeSection = useCallback((sectionId: string) => {
    setReportSections(prev => prev.filter(section => section.id !== sectionId))
  }, [])

  const sendTestEmail = useCallback(async () => {
    setIsSendingEmail(true)
    try {
      // Convert reportSections to serializable format
      const serializableReportSections = reportSections.map(section => ({
        id: section.id,
        name: section.name,
        type: section.type,
        dataSource: {
          id: section.dataSource.id,
          name: section.dataSource.name,
          company: section.dataSource.company,
          color: section.dataSource.color,
          // Remove the React component logo
        }
      }))

      const response = await fetch('/api/email/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: user?.email,
          reportSections: serializableReportSections,
          scheduledTime: selectedTime,
          userEmail: user?.email,
          userName: user?.firstName || user?.email?.split('@')[0] || 'User'
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Test email sent successfully! Check your inbox.')
      } else {
        alert('Failed to send email: ' + data.error)
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      alert('Failed to send test email')
    }
    setIsSendingEmail(false)
  }, [reportSections, selectedTime])

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Report Builder</h1>
          <p className="text-gray-600">Drag data sources to create your personalized daily report</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - DATA Sources */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="h-6 w-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">DATA</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataSources.map((source) => (
                <Card 
                  key={source.id}
                  className={`cursor-grab active:cursor-grabbing transition-transform hover:scale-105 ${source.color} border-2 border-dashed`}
                  draggable
                  onDragStart={() => handleDragStart(source)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-3">
                      {source.logo}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{source.name}</h3>
                    <p className="text-xs text-gray-600">{source.company}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Schedule Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Email Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Send report every day at:</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-2">
                    <Mail className="h-4 w-4 mr-2" />
                    Save Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={sendTestEmail}
                    disabled={isSendingEmail || reportSections.length === 0}
                  >
                    {isSendingEmail ? 'Sending...' : 'Send Test Email'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - REPORT Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-6 w-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">REPORT</h2>
            </div>

            {/* Mobile Phone Container */}
            <div className="mx-auto max-w-sm">
              <div className="bg-gradient-to-b from-orange-400 to-orange-500 p-4 rounded-t-3xl">
                <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-center">
                  <span className="text-sm font-medium">REPORT</span>
                </div>
              </div>
              
              <div 
                className="bg-blue-600 min-h-96 p-4 rounded-b-3xl relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="bg-white rounded-lg p-4 h-full min-h-80">
                  {reportSections.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <div className="mb-4">
                        <p className="text-sm font-medium">This Is Your AI report add</p>
                        <p className="text-sm">the data you want and</p>
                        <p className="text-sm">every day at (Drop down</p>
                        <p className="text-sm">menu to show you what</p>
                        <p className="text-sm">time you want this report</p>
                        <p className="text-sm">to be sent to you ) Here is</p>
                        <p className="text-sm">you AI report</p>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                        <p className="text-xs text-gray-400">Drag data sources here</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">Daily AI Report</h3>
                      {reportSections.map((section, index) => (
                        <div 
                          key={section.id} 
                          className={`p-3 rounded-lg border-l-4 ${section.dataSource.color} relative group`}
                        >
                          <div className="flex items-center gap-2">
                            {section.dataSource.logo}
                            <div>
                              <p className="text-sm font-medium">{section.dataSource.name}</p>
                              <p className="text-xs text-gray-500">{section.dataSource.company}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeSection(section.id)}
                            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-100 rounded px-1"
                          >
                            ✕
                          </button>
                          {/* Mock data visualization */}
                          <div className="mt-2 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setReportSections([])}>
                Clear Report
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Preview Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Email Report Preview</DialogTitle>
                    <DialogDescription>
                      This is how your daily AI report will look when sent at {selectedTime}
                    </DialogDescription>
                  </DialogHeader>
                  <EmailReportTemplate 
                    reportSections={reportSections} 
                    scheduledTime={selectedTime} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}