import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Calendar, AlertCircle } from "lucide-react"

interface AnnouncementsProps {
  storeId: string
}

export function Announcements({ storeId }: AnnouncementsProps) {
  // Mock data - in real app, fetch from database
  const announcements = [
    {
      id: 1,
      title: "Holiday Schedule Update",
      message: "Store will close early on Christmas Eve at 6:00 PM. Regular hours resume December 26th.",
      type: "important",
      date: "Dec 15, 2024",
      author: "Store Manager",
    },
    {
      id: 2,
      title: "New Menu Items",
      message: "We're introducing three new Blizzard flavors this week. Please review the preparation guide.",
      type: "info",
      date: "Dec 14, 2024",
      author: "Regional Manager",
    },
    {
      id: 3,
      title: "Team Meeting",
      message: "Monthly team meeting scheduled for Friday at 3:00 PM in the break room.",
      type: "meeting",
      date: "Dec 13, 2024",
      author: "Store Manager",
    },
    {
      id: 4,
      title: "Great Job This Week!",
      message: "Excellent customer service scores this week. Keep up the fantastic work, team!",
      type: "praise",
      date: "Dec 12, 2024",
      author: "Store Manager",
    },
  ]

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "important":
        return <Badge className="bg-red-100 text-red-800">Important</Badge>
      case "meeting":
        return <Badge className="bg-blue-100 text-blue-800">Meeting</Badge>
      case "praise":
        return <Badge className="bg-green-100 text-green-800">Recognition</Badge>
      default:
        return <Badge variant="secondary">Info</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "important":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "meeting":
        return <Calendar className="h-4 w-4 text-blue-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Announcements
        </CardTitle>
        <CardDescription>Latest updates and messages from management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getTypeIcon(announcement.type)}
                <h4 className="font-medium text-sm">{announcement.title}</h4>
              </div>
              {getTypeBadge(announcement.type)}
            </div>
            <p className="text-sm text-gray-700">{announcement.message}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>By {announcement.author}</span>
              <span>{announcement.date}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
