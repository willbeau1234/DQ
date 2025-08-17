import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface RecentUploadsProps {
  userId: string
}

export default async function RecentUploads({ userId }: RecentUploadsProps) {
  const supabase = createClient()

  const { data: uploads } = await supabase
    .from("data_uploads")
    .select("*")
    .eq("uploaded_by", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Uploads
        </CardTitle>
        <CardDescription>Track your recent data uploads and processing status</CardDescription>
      </CardHeader>
      <CardContent>
        {uploads && uploads.length > 0 ? (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(upload.status)}
                  <div>
                    <p className="text-sm font-medium text-slate-900">{upload.file_name}</p>
                    <p className="text-xs text-slate-500">{new Date(upload.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(upload.status)}>{upload.status}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-8">
            No uploads yet. Upload your first CSV file to get started.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
