import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from "lucide-react"

interface StaffScheduleProps {
  storeId: string
}

export function StaffSchedule({ storeId }: StaffScheduleProps) {
  // Mock data - in real app, fetch from database
  const staffSchedule = [
    { name: "Sarah Johnson", role: "Team Lead", shift: "8:00 AM - 4:00 PM", status: "on-duty" },
    { name: "Mike Chen", role: "Cashier", shift: "10:00 AM - 6:00 PM", status: "on-duty" },
    { name: "Emma Davis", role: "Kitchen Staff", shift: "12:00 PM - 8:00 PM", status: "break" },
    { name: "Alex Rodriguez", role: "Cashier", shift: "2:00 PM - 10:00 PM", status: "scheduled" },
    { name: "Lisa Wang", role: "Kitchen Staff", shift: "4:00 PM - 12:00 AM", status: "scheduled" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-duty":
        return <Badge className="bg-green-100 text-green-800">On Duty</Badge>
      case "break":
        return <Badge className="bg-yellow-100 text-yellow-800">On Break</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      default:
        return <Badge variant="secondary">Off</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Staff Schedule
        </CardTitle>
        <CardDescription>Today's staff schedule and status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {staffSchedule.map((staff, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {staff.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{staff.name}</p>
                <p className="text-xs text-muted-foreground">{staff.role}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{staff.shift}</span>
              </div>
              {getStatusBadge(staff.status)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
