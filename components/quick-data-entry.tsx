"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuickDataEntryProps {
  storeId: string
  onSaveComplete?: () => void
}

export function QuickDataEntry({ storeId, onSaveComplete }: QuickDataEntryProps) {
  const [quickData, setQuickData] = useState({
    total_sales: "",
    transaction_count: "",
    labor_cost: "",
    food_cost: "",
  })
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleQuickSave = async () => {
    if (!quickData.total_sales || !quickData.transaction_count) {
      toast({
        title: "Missing Data",
        description: "Please enter at least sales and transaction count",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/manual-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          date: new Date().toISOString().split("T")[0],
          ...quickData,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Quick data entry saved successfully",
        })
        setQuickData({
          total_sales: "",
          transaction_count: "",
          labor_cost: "",
          food_cost: "",
        })
        onSaveComplete?.()
      } else {
        throw new Error("Failed to save data")
      }
    } catch (error) {
      console.error("Error saving quick data:", error)
      toast({
        title: "Error",
        description: "Failed to save data",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Entry
        </CardTitle>
        <CardDescription>Quickly enter today's essential metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm">Sales ($)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={quickData.total_sales}
              onChange={(e) => setQuickData({ ...quickData, total_sales: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Transactions</Label>
            <Input
              type="number"
              placeholder="0"
              value={quickData.transaction_count}
              onChange={(e) => setQuickData({ ...quickData, transaction_count: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Labor Cost ($)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={quickData.labor_cost}
              onChange={(e) => setQuickData({ ...quickData, labor_cost: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Food Cost ($)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={quickData.food_cost}
              onChange={(e) => setQuickData({ ...quickData, food_cost: e.target.value })}
            />
          </div>
        </div>

        <Button onClick={handleQuickSave} disabled={saving} className="w-full">
          {saving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-pulse" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Quick Save
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
