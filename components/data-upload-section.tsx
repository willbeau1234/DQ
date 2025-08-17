"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { uploadCSV } from "@/lib/upload-actions"

interface DataUploadSectionProps {
  storeId?: string
}

export default function DataUploadSection({ storeId }: DataUploadSectionProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success?: string; error?: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setUploadResult(null)
    } else {
      setUploadResult({ error: "Please select a valid CSV file" })
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !storeId) return

    setUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("storeId", storeId)

      const result = await uploadCSV(formData)
      setUploadResult(result)

      if (result.success) {
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById("csv-file") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
    } catch (error) {
      setUploadResult({ error: "Upload failed. Please try again." })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Daily Data
        </CardTitle>
        <CardDescription>
          Upload your daily operations data in CSV format. Our system will automatically process and generate reports.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!storeId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Please contact your administrator to assign a store ID to your account.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="csv-file" className="block text-sm font-medium text-slate-700 mb-2">
              Select CSV File
            </label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={!storeId || uploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              <FileText className="h-4 w-4" />
              <span>{file.name}</span>
              <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}

          {uploadResult && (
            <div
              className={`p-4 rounded-lg border ${
                uploadResult.success
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {uploadResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <p className="text-sm">{uploadResult.success || uploadResult.error}</p>
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || !storeId || uploading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {uploading ? "Processing..." : "Upload and Process"}
          </Button>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-medium text-slate-900 mb-2">Expected CSV Format:</h4>
          <p className="text-sm text-slate-600 mb-2">
            Your CSV should include columns for: Date, Sales, Transactions, Labor Hours, Labor Cost, Food Cost, etc.
          </p>
          <p className="text-sm text-slate-500">The system will automatically map common column names and formats.</p>
        </div>
      </CardContent>
    </Card>
  )
}
