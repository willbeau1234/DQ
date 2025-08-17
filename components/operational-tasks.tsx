import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface OperationalTasksProps {
  storeId: string
}

export function OperationalTasks({ storeId }: OperationalTasksProps) {
  // Mock data - in real app, fetch from database
  const tasks = [
    { id: 1, task: "Complete morning inventory check", priority: "high", completed: false, dueTime: "9:00 AM" },
    { id: 2, task: "Review yesterday's sales report", priority: "medium", completed: true, dueTime: "10:00 AM" },
    { id: 3, task: "Schedule staff for weekend", priority: "high", completed: false, dueTime: "2:00 PM" },
    { id: 4, task: "Order supplies for next week", priority: "medium", completed: false, dueTime: "4:00 PM" },
    { id: 5, task: "Conduct team meeting", priority: "low", completed: true, dueTime: "6:00 PM" },
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">Normal</Badge>
    }
  }

  const getPriorityIcon = (priority: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (priority === "high") return <AlertTriangle className="h-4 w-4 text-red-500" />
    return <Clock className="h-4 w-4 text-gray-500" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Tasks</CardTitle>
        <CardDescription>Operational tasks and priorities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox checked={task.completed} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>{task.task}</p>
              <div className="flex items-center gap-2 mt-1">
                {getPriorityIcon(task.priority, task.completed)}
                <span className="text-xs text-muted-foreground">{task.dueTime}</span>
              </div>
            </div>
            {getPriorityBadge(task.priority)}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
