"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Users, DollarSign } from "lucide-react"

interface EmailReportProps {
  reportSections: Array<{
    id: string
    name: string
    type: 'chart' | 'metric' | 'table'
    dataSource: {
      id: string
      name: string
      company: string
      logo: React.ReactNode
      color: string
    }
  }>
  scheduledTime: string
}

export function EmailReportTemplate({ reportSections, scheduledTime }: EmailReportProps) {
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const mockMetrics = {
    'pos-sales': {
      title: 'Daily Sales Performance',
      value: '$24,850',
      trend: '+12.5%',
      isPositive: true,
      subtitle: 'vs yesterday'
    },
    'inventory': {
      title: 'Inventory Status',
      value: '94%',
      trend: '+2.1%',
      isPositive: true,
      subtitle: 'stock efficiency'
    },
    'customer-data': {
      title: 'Customer Satisfaction',
      value: '4.3/5',
      trend: '+0.2',
      isPositive: true,
      subtitle: 'rating score'
    },
    'financial': {
      title: 'Financial Health',
      value: '$18,200',
      trend: '+8.7%',
      isPositive: true,
      subtitle: 'net profit'
    },
    'performance': {
      title: 'Performance KPIs',
      value: '87%',
      trend: '-1.2%',
      isPositive: false,
      subtitle: 'efficiency score'
    },
    'labor-data': {
      title: 'Labor Analytics',
      value: '18.5%',
      trend: '-0.8%',
      isPositive: true,
      subtitle: 'of revenue'
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg">
      {/* Email Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Daily AI Report</h1>
            <p className="text-blue-100">Dairy Queen Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Generated at {scheduledTime}</p>
            <p className="text-sm text-blue-100">{formatDate()}</p>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Executive Summary</h2>
        </div>
        <p className="text-gray-700 text-sm">
          Your automated daily report includes {reportSections.length} key data insights 
          across your selected business metrics. All data is current as of this morning.
        </p>
      </div>

      {/* Report Sections */}
      <div className="p-6 space-y-6">
        {reportSections.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No data sources selected</p>
            <p className="text-sm">Add data sources to see your report preview</p>
          </div>
        ) : (
          reportSections.map((section) => {
            const metric = mockMetrics[section.dataSource.id as keyof typeof mockMetrics]
            return (
              <Card key={section.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    {section.dataSource.logo}
                    <div>
                      <div className="text-gray-900">{metric?.title || section.dataSource.name}</div>
                      <div className="text-sm text-gray-500 font-normal">
                        Powered by {section.dataSource.company}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {metric?.value || 'Loading...'}
                      </div>
                      <div className="text-sm text-gray-600">{metric?.subtitle}</div>
                    </div>
                    <div>
                      <div className={`flex items-center gap-1 ${
                        metric?.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric?.isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-semibold">{metric?.trend}</span>
                      </div>
                      <div className="text-sm text-gray-600">vs yesterday</div>
                    </div>
                    <div>
                      <Badge 
                        variant={metric?.isPositive ? 'default' : 'destructive'} 
                        className="text-xs"
                      >
                        {metric?.isPositive ? 'On Track' : 'Monitor'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Mock Chart Visualization */}
                  <div className="mt-4 h-24 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-blue-400" />
                    <span className="ml-2 text-sm text-blue-600">Interactive chart would appear here</span>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-6 border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              This report was automatically generated by your DQ AI Dashboard
            </p>
            <p className="text-xs text-gray-500">
              Scheduled for {scheduledTime} daily
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-xs">
              AI Generated
            </Badge>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            © 2024 Dairy Queen Dashboard | Powered by AI Analytics
          </p>
        </div>
      </div>
    </div>
  )
}