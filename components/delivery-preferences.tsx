"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Clock, Users, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DeliveryPreferencesProps {
  storeId: string
}

interface Recipient {
  name: string
  email: string
  role: string
}

export function DeliveryPreferences({ storeId }: DeliveryPreferencesProps) {
  const [preferences, setPreferences] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [newRecipient, setNewRecipient] = useState<Recipient>({ name: "", email: "", role: "manager" })
  const { toast } = useToast()

  useEffect(() => {
    fetchPreferences()
  }, [storeId])

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`/api/schedule-reports?storeId=${storeId}`)
      const result = await response.json()

      if (result.data) {
        setPreferences(result.data)
        setRecipients(result.data.recipients || [])
      } else {
        // Set default preferences
        setPreferences({
          enabled: false,
          delivery_time: "08:00",
          delivery_method: "email",
          frequency: "daily",
          recipients: [],
        })
      }
    } catch (error) {
      console.error("Error fetching preferences:", error)
      toast({
        title: "Error",
        description: "Failed to load delivery preferences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/schedule-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          scheduleConfig: {
            ...preferences,
            recipients,
          },
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Delivery preferences saved successfully",
        })
      } else {
        throw new Error("Failed to save preferences")
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save delivery preferences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addRecipient = () => {
    if (newRecipient.name && newRecipient.email) {
      setRecipients([...recipients, { ...newRecipient }])
      setNewRecipient({ name: "", email: "", role: "manager" })
    }
  }

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index))
  }

  const updatePreference = (key: string, value: any) => {
    setPreferences({ ...preferences, [key]: value })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading delivery preferences...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Automated Report Delivery
        </CardTitle>
        <CardDescription>Configure automatic delivery of daily reports via email</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Automated Delivery</Label>
                <div className="text-sm text-muted-foreground">Automatically send daily reports</div>
              </div>
              <Switch
                checked={preferences?.enabled || false}
                onCheckedChange={(checked) => updatePreference("enabled", checked)}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Delivery Time</Label>
                <Input
                  type="time"
                  value={preferences?.delivery_time || "08:00"}
                  onChange={(e) => updatePreference("delivery_time", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={preferences?.frequency || "daily"}
                  onValueChange={(value) => updatePreference("frequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Delivery Method</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Email Only</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <Label className="text-base">Report Recipients</Label>
              </div>

              {recipients.length > 0 && (
                <div className="space-y-2">
                  {recipients.map((recipient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{recipient.name}</p>
                        <p className="text-xs text-muted-foreground">{recipient.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{recipient.role}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => removeRecipient(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border rounded-lg p-4 space-y-4">
                <Label className="text-sm font-medium">Add New Recipient</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Full Name"
                    value={newRecipient.name}
                    onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={newRecipient.email}
                    onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                  />
                  <Select
                    value={newRecipient.role}
                    onValueChange={(value) => setNewRecipient({ ...newRecipient, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addRecipient} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recipient
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Label className="text-base">Email Templates</Label>
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Owner Report Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      High-level business metrics, profitability analysis, and strategic insights
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Manager Report Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Operational efficiency, staff performance, and daily improvement recommendations
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Employee Report Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Team performance highlights, achievements, and positive feedback
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={savePreferences} disabled={saving}>
            {saving ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
