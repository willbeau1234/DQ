"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Clock, TestTube, CheckCircle, XCircle, Loader2, Upload } from "lucide-react"

interface EmailTestPanelProps {
  storeId: string
}

export function EmailTestPanel({ storeId }: EmailTestPanelProps) {
  const [testing, setTesting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [importResults, setImportResults] = useState<any>(null)

  const runEmailTest = async () => {
    setTesting(true)
    setTestResults(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testMode: true,
          storeId
        }),
      })

      const result = await response.json()
      setTestResults(result)

    } catch (error) {
      setTestResults({
        success: false,
        error: 'Failed to run test',
        timestamp: new Date().toISOString()
      })
    } finally {
      setTesting(false)
    }
  }

  const importCSVData = async () => {
    setImporting(true)
    setImportResults(null)

    try {
      const response = await fetch('/api/import-csv-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const result = await response.json()
      setImportResults(result)

    } catch (error) {
      setImportResults({
        success: false,
        error: 'Failed to import data',
        timestamp: new Date().toISOString()
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Email System Test
        </CardTitle>
        <CardDescription>
          Test the automated daily email system manually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Import CSV Data First</p>
            <p className="text-xs text-muted-foreground">
              Import data from daily.csv file into the database
            </p>
          </div>
          <Button
            onClick={importCSVData}
            disabled={importing}
            className="gap-2"
            variant="outline"
          >
            {importing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import Data
              </>
            )}
          </Button>
        </div>

        {importResults && (
          <>
            <div
              className={`p-4 rounded-lg border ${
                importResults.success
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {importResults.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <p className="text-sm">{importResults.success ? importResults.message : importResults.error}</p>
              </div>
              {importResults.stores && (
                <p className="text-xs mt-2">Stores: {importResults.stores.join(', ')}</p>
              )}
            </div>
          </>
        )}

        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Manual Test Trigger</p>
            <p className="text-xs text-muted-foreground">
              Simulates the 8:30 AM CST daily email process
            </p>
          </div>
          <Button
            onClick={runEmailTest}
            disabled={testing}
            className="gap-2"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Run Test
              </>
            )}
          </Button>
        </div>

        {testResults && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {testResults.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">
                  {testResults.success ? 'Test Completed' : 'Test Failed'}
                </span>
                <Badge variant={testResults.success ? 'default' : 'destructive'}>
                  {testResults.success ? 'Success' : 'Error'}
                </Badge>
              </div>

              <div className="text-sm space-y-2">
                <p><strong>Timestamp:</strong> {new Date(testResults.timestamp).toLocaleString()}</p>
                <p><strong>Message:</strong> {testResults.message || testResults.error}</p>
                
                {testResults.results && testResults.results.length > 0 && (
                  <div className="space-y-2">
                    <p><strong>Email Results:</strong></p>
                    <div className="bg-muted p-3 rounded-md text-xs space-y-1">
                      {testResults.results.map((result: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          <span>
                            {result.recipient || result.store} - {result.success ? 'Sent' : result.error}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <Separator />
        
        <div className="space-y-2 text-xs text-muted-foreground">
          <p><strong>Updated Testing Steps:</strong></p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Step 1:</strong> Click "Import Data" to load your CSV file</li>
            <li>• <strong>Step 2:</strong> Click "Run Test" to send AI-generated report</li>
            <li>• <strong>Step 3:</strong> Check your email (beaum045@umn.edu) for the report</li>
            <li>• Report includes sales analysis, insights, and recommendations</li>
            <li>• System automatically uses most recent data available</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}