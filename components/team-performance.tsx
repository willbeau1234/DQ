import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface TeamPerformanceProps {
  storeId: string
}

export function TeamPerformance({ storeId }: TeamPerformanceProps) {
  // Mock data - in real app, fetch from database
  const teamMembers = [
    { name: "Sarah Johnson", role: "Team Lead", rating: 4.9, status: "excellent" },
    { name: "Mike Chen", role: "Cashier", rating: 4.7, status: "good" },
    { name: "Emma Davis", role: "Kitchen Staff", rating: 4.8, status: "excellent" },
    { name: "Alex Rodriguez", role: "Cashier", rating: 4.6, status: "good" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      default:
        return <Badge variant="secondary">Average</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
        <CardDescription>Current team ratings and achievements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{member.rating}</span>
              </div>
              {getStatusBadge(member.status)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
