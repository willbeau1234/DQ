import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users } from "lucide-react"

interface StoreOverviewProps {
  storeId: string
}

export function StoreOverview({ storeId }: StoreOverviewProps) {
  // Mock data - in real app, fetch from database
  const storeData = {
    name: "DQ Downtown",
    location: "123 Main St, Downtown",
    status: "operational",
    hoursToday: "10:00 AM - 10:00 PM",
    staffCount: 12,
    todaySales: 1247,
    todayGoal: 1500,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {storeData.name}
        </CardTitle>
        <CardDescription>{storeData.location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge className="bg-green-100 text-green-800">Operational</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Hours Today
          </span>
          <span className="text-sm">{storeData.hoursToday}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff Count
          </span>
          <span className="text-sm">{storeData.staffCount} employees</span>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm text-muted-foreground">
              ${storeData.todaySales} / ${storeData.todayGoal}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(storeData.todaySales / storeData.todayGoal) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
