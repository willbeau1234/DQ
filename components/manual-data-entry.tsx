"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Save, Calculator, AlertCircle, CheckCircle, Edit3 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface ManualDataEntryProps {
  storeId: string
}

interface DailyMetrics {
  total_sales: string
  transaction_count: string
  labor_hours: string
  labor_cost: string
  food_cost: string
  customer_count: string
  weather: string
  special_events: string
  notes: string
}

export function ManualDataEntry({ storeId }: ManualDataEntryProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [metrics, setMetrics] = useState<DailyMetrics>({
    total_sales: "",
    transaction_count: "",
    labor_hours: "",
    labor_cost: "",
    food_cost: "",
    customer_count: "",
    weather: "",
    special_events: "",
    notes: "",
  })
  const [calculatedMetrics, setCalculatedMetrics] = useState({
    average_ticket: 0,
    labor_percentage: 0,
    food_percentage: 0,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [existingData, setExistingData] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedDate && storeId) {
      fetchExistingData()
    }
  }, [selectedDate, storeId])

  useEffect(() => {
    calculateDerivedMetrics()
  }, [metrics.total_sales, metrics.transaction_count, metrics.labor_cost, metrics.food_cost])

  const fetchExistingData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/manual-data?storeId=${storeId}&date=${format(selectedDate, "yyyy-MM-dd")}`)
      const result = await response.json()

      if (result.data) {
        setExistingData(result.data)
        setMetrics({
          total_sales: result.data.total_sales?.toString() || "",
          transaction_count: result.data.transaction_count?.toString() || "",
          labor_hours: result.data.labor_hours?.toString() || "",
          labor_cost: result.data.labor_cost?.toString() || "",
          food_cost: result.data.food_cost?.toString() || "",
          customer_count: result.data.customer_count?.toString() || "",
          weather: result.data.weather || "",
          special_events: result.data.special_events || "",
          notes: result.data.notes || "",
        })
      } else {
        setExistingData(null)
        setMetrics({
          total_sales: "",
          transaction_count: "",
          labor_hours: "",
          labor_cost: "",
          food_cost: "",
          customer_count: "",
          weather: "",
          special_events: "",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error fetching existing data:", error)
      toast({
        title: "Error",
        description: "Failed to load existing data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateDerivedMetrics = () => {
    const totalSales = Number.parseFloat(metrics.total_sales) || 0
    const transactionCount = Number.parseInt(metrics.transaction_count) || 0
    const laborCost = Number.parseFloat(metrics.labor_cost) || 0
    const foodCost = Number.parseFloat(metrics.food_cost) || 0

    setCalculatedMetrics({
      average_ticket: transactionCount > 0 ? totalSales / transactionCount : 0,
      labor_percentage: totalSales > 0 ? (laborCost / totalSales) * 100 : 0,
      food_percentage: totalSales > 0 ? (foodCost / totalSales) * 100 : 0,
    })
  }

  const handleInputChange = (field: keyof DailyMetrics, value: string) => {
    setMetrics({ ...metrics, [field]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/manual-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          date: format(selectedDate, "yyyy-MM-dd"),
          ...metrics,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setExistingData(result.data)
        toast({
          title: "Success",
          description: existingData ? "Data updated successfully" : "Data saved successfully",
        })
      } else {
        throw new Error("Failed to save data")
      }
    } catch (error) {
      console.error("Error saving data:", error)
      toast({
        title: "Error",
        description: "Failed to save data",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const isFormValid = () => {
    return metrics.total_sales && metrics.transaction_count && metrics.labor_cost && metrics.food_cost
  }

  const getValidationStatus = (field: keyof DailyMetrics) => {
    const requiredFields = ["total_sales", "transaction_count", "labor_cost", "food_cost"]
    if (requiredFields.includes(field)) {
      return metrics[field] ? "valid" : "invalid"
    }
    return "optional"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Manual Data Entry
          </CardTitle>
          <CardDescription>Enter daily metrics manually when CSV upload is not available</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-[240px] justify-start text-left font-normal")}
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
                </PopoverContent>
              </Popover>
            </div>

            {existingData && (
              <Badge className="bg-blue-100 text-blue-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Data exists for this date
              </Badge>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">Loading existing data...</div>
          ) : (
            <Tabs defaultValue="sales" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sales">Sales & Transactions</TabsTrigger>
                <TabsTrigger value="costs">Labor & Food Costs</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="sales" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Total Sales ($) *
                      {getValidationStatus("total_sales") === "valid" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {getValidationStatus("total_sales") === "invalid" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={metrics.total_sales}
                      onChange={(e) => handleInputChange("total_sales", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Transaction Count *
                      {getValidationStatus("transaction_count") === "valid" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {getValidationStatus("transaction_count") === "invalid" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={metrics.transaction_count}
                      onChange={(e) => handleInputChange("transaction_count", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Customer Count</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={metrics.customer_count}
                      onChange={(e) => handleInputChange("customer_count", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Average Ticket (Calculated)
                    </Label>
                    <Input
                      type="text"
                      value={`$${calculatedMetrics.average_ticket.toFixed(2)}`}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="costs" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Labor Hours</Label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="0.0"
                      value={metrics.labor_hours}
                      onChange={(e) => handleInputChange("labor_hours", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Labor Cost ($) *
                      {getValidationStatus("labor_cost") === "valid" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {getValidationStatus("labor_cost") === "invalid" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={metrics.labor_cost}
                      onChange={(e) => handleInputChange("labor_cost", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Food Cost ($) *
                      {getValidationStatus("food_cost") === "valid" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {getValidationStatus("food_cost") === "invalid" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={metrics.food_cost}
                      onChange={(e) => handleInputChange("food_cost", e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Labor % (Calculated)
                      </Label>
                      <Input
                        type="text"
                        value={`${calculatedMetrics.labor_percentage.toFixed(1)}%`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Food % (Calculated)
                      </Label>
                      <Input
                        type="text"
                        value={`${calculatedMetrics.food_percentage.toFixed(1)}%`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="operations" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Weather Conditions</Label>
                    <Input
                      placeholder="e.g., Sunny, Rainy, Snow, etc."
                      value={metrics.weather}
                      onChange={(e) => handleInputChange("weather", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Special Events</Label>
                    <Input
                      placeholder="e.g., Local festival, Holiday promotion, etc."
                      value={metrics.special_events}
                      onChange={(e) => handleInputChange("special_events", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      placeholder="Any additional observations, issues, or notes about the day..."
                      value={metrics.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Sales Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Sales:</span>
                        <span className="font-medium">${metrics.total_sales || "0.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transactions:</span>
                        <span className="font-medium">{metrics.transaction_count || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Ticket:</span>
                        <span className="font-medium">${calculatedMetrics.average_ticket.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customers:</span>
                        <span className="font-medium">{metrics.customer_count || "0"}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Cost Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Labor Cost:</span>
                        <span className="font-medium">${metrics.labor_cost || "0.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labor %:</span>
                        <span className="font-medium">{calculatedMetrics.labor_percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Food Cost:</span>
                        <span className="font-medium">${metrics.food_cost || "0.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Food %:</span>
                        <span className="font-medium">{calculatedMetrics.food_percentage.toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Data Validation</p>
                    <p className="text-xs text-muted-foreground">
                      {isFormValid() ? "All required fields completed" : "Please complete all required fields (*)"}
                    </p>
                  </div>
                  <Button onClick={handleSave} disabled={!isFormValid() || saving}>
                    {saving ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-pulse" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {existingData ? "Update Data" : "Save Data"}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
