"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle, Save } from "lucide-react"
import { format } from "date-fns"

interface FormData {
  date: Date | undefined
  location: string
  sales: string
  transactions: string
  laborHours: string
  laborCost: string
  driveThruTime: string
  customerSatisfaction: string
  inventoryNotes: string
  maintenanceIssues: string
}

export function ManualEntry() {
  const [formData, setFormData] = useState<FormData>({
    date: new Date(),
    location: "",
    sales: "",
    transactions: "",
    laborHours: "",
    laborCost: "",
    driveThruTime: "",
    customerSatisfaction: "",
    inventoryNotes: "",
    maintenanceIssues: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const locations = [
    { id: "DQ001", name: "Downtown Location" },
    { id: "DQ002", name: "Mall Location" },
    { id: "DQ003", name: "Airport Location" },
    { id: "DQ004", name: "University Location" },
    { id: "DQ005", name: "Suburban Location" },
    { id: "DQ006", name: "Highway Location" },
  ]

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock success/error
    const success = Math.random() > 0.1
    setSubmitStatus(success ? "success" : "error")
    setIsSubmitting(false)

    if (success) {
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          date: new Date(),
          location: "",
          sales: "",
          transactions: "",
          laborHours: "",
          laborCost: "",
          driveThruTime: "",
          customerSatisfaction: "",
          inventoryNotes: "",
          maintenanceIssues: "",
        })
        setSubmitStatus("idle")
      }, 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the date and location for this data entry</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Select onValueChange={(value) => handleInputChange("location", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.id} - {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sales & Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Sales & Operations</CardTitle>
          <CardDescription>Enter daily sales and operational metrics</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sales">Sales Revenue ($)</Label>
            <Input
              id="sales"
              type="number"
              step="0.01"
              placeholder="4850.75"
              value={formData.sales}
              onChange={(e) => handleInputChange("sales", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactions">Transaction Count</Label>
            <Input
              id="transactions"
              type="number"
              placeholder="247"
              value={formData.transactions}
              onChange={(e) => handleInputChange("transactions", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="laborHours">Labor Hours</Label>
            <Input
              id="laborHours"
              type="number"
              step="0.5"
              placeholder="48.5"
              value={formData.laborHours}
              onChange={(e) => handleInputChange("laborHours", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="laborCost">Labor Cost ($)</Label>
            <Input
              id="laborCost"
              type="number"
              step="0.01"
              placeholder="728.50"
              value={formData.laborCost}
              onChange={(e) => handleInputChange("laborCost", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driveThruTime">Avg Drive-Thru Time (seconds)</Label>
            <Input
              id="driveThruTime"
              type="number"
              placeholder="125"
              value={formData.driveThruTime}
              onChange={(e) => handleInputChange("driveThruTime", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerSatisfaction">Customer Satisfaction (1-5)</Label>
            <Select onValueChange={(value) => handleInputChange("customerSatisfaction", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Poor</SelectItem>
                <SelectItem value="2">2 - Fair</SelectItem>
                <SelectItem value="3">3 - Good</SelectItem>
                <SelectItem value="4">4 - Very Good</SelectItem>
                <SelectItem value="5">5 - Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Optional notes about inventory, maintenance, or other observations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inventoryNotes">Inventory Notes</Label>
            <Textarea
              id="inventoryNotes"
              placeholder="Any inventory issues, low stock items, or supply notes..."
              value={formData.inventoryNotes}
              onChange={(e) => handleInputChange("inventoryNotes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenanceIssues">Maintenance Issues</Label>
            <Textarea
              id="maintenanceIssues"
              placeholder="Equipment problems, repair needs, or maintenance completed..."
              value={formData.maintenanceIssues}
              onChange={(e) => handleInputChange("maintenanceIssues", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Status */}
      {submitStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Data saved successfully! Your entry has been recorded.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            Failed to save data. Please check your entries and try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !formData.location} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
  )
}
