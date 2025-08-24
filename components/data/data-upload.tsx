"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle, AlertTriangle } from "lucide-react"

interface CSVData {
  headers: string[]
  rows: string[][]
}

export function DataUpload() {
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  const requiredColumns = [
    { key: "date", label: "Date" },
    { key: "sales", label: "Sales Revenue" },
    { key: "transactions", label: "Transaction Count" },
    { key: "laborHours", label: "Labor Hours" },
    { key: "laborCost", label: "Labor Cost" },
    { key: "driveThruTime", label: "Drive-Thru Time" },
    { key: "customerSatisfaction", label: "Customer Satisfaction" },
  ]

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())
      const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()))

      setCsvData({ headers, rows })
      setUploadStatus("idle")
    }
    reader.readAsText(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find((file) => file.type === "text/csv" || file.name.endsWith(".csv"))

    if (csvFile) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim())
        const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()))

        setCsvData({ headers, rows })
        setUploadStatus("idle")
      }
      reader.readAsText(csvFile)
    }
  }, [])

  const handleColumnMapping = (requiredColumn: string, csvColumn: string) => {
    setColumnMapping((prev) => ({ ...prev, [requiredColumn]: csvColumn }))
  }

  const handleUpload = async () => {
    setIsUploading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock success/error
    const success = Math.random() > 0.2
    setUploadStatus(success ? "success" : "error")
    setIsUploading(false)

    if (success) {
      // Reset form after successful upload
      setTimeout(() => {
        setCsvData(null)
        setColumnMapping({})
        setUploadStatus("idle")
      }, 3000)
    }
  }

  const isValidMapping = requiredColumns.every((col) => columnMapping[col.key])

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Upload your daily restaurant data in CSV format. Supported columns: Date, Sales, Transactions, Labor Hours,
            etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Drag and drop your CSV file here</p>
            <p className="text-muted-foreground mb-4">or click to browse files</p>
            <Input type="file" accept=".csv" onChange={handleFileUpload} className="max-w-xs mx-auto" id="csv-upload" />
          </div>
        </CardContent>
      </Card>

      {/* Column Mapping */}
      {csvData && (
        <Card>
          <CardHeader>
            <CardTitle>Map Columns</CardTitle>
            <CardDescription>Match your CSV columns to the required data fields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredColumns.map((column) => (
                <div key={column.key} className="space-y-2">
                  <Label htmlFor={column.key}>{column.label}</Label>
                  <Select onValueChange={(value) => handleColumnMapping(column.key, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvData.headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {csvData && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>Preview of your uploaded data (first 5 rows)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {csvData.headers.map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.rows.slice(0, 5).map((row, index) => (
                    <TableRow key={index}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {csvData.rows.length > 5 && (
              <p className="text-sm text-muted-foreground mt-2">... and {csvData.rows.length - 5} more rows</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Status */}
      {uploadStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Data uploaded successfully! {csvData?.rows.length} records have been processed.
          </AlertDescription>
        </Alert>
      )}

      {uploadStatus === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Upload failed. Please check your file format and try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Button */}
      {csvData && (
        <div className="flex justify-end">
          <Button onClick={handleUpload} disabled={!isValidMapping || isUploading} size="lg">
            {isUploading ? "Uploading..." : `Upload ${csvData.rows.length} Records`}
          </Button>
        </div>
      )}
    </div>
  )
}
