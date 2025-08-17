import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"

interface MyScheduleProps {
  userId: string
}

export function MySchedule({ userId }: MyScheduleProps) {
  // Mock data - in real app, fetch from database
  const schedule = [
    { day: "Today", date: "Dec 15", shift: "2:00 PM - 10:00 PM", status: "current" },
    { day: "Tomorrow", date: "Dec 16", shift: "10:00 AM - 6:00 PM", status: "upcoming" },
    { day: "Wednesday", date: "Dec 17", shift: "Off", status: "off" },
    { day: "Thursday", date: "Dec 18", shift: "2:00 PM - 10:00 PM", status: "upcoming" },
    { day: "Friday", date: "Dec 19", shift: "10:00 AM - 6:00 PM", status: "upcoming" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "current":
        return <Badge className="bg-blue-100 text-blue-800">Current</Badge>
      case "upcoming":
        return <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
      case "off":
        return <Badge variant="secondary">Day Off</Badge>
      default:
        return <Badge variant="secondary">TBD</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          My Schedule
        </CardTitle>
        <CardDescription>Your upcoming work schedule</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium text-sm">{item.day}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-medium">{item.shift}</p>
              {getStatusBadge(item.status)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
