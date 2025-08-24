import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BarChart3, Users, TrendingUp, MapPin } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-primary-foreground">DQ</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">Dairy Queen</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-6">AI Reporting Dashboard</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your franchise operations with intelligent reporting, real-time analytics, and automated insights
            across all your locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Everything You Need to Manage Your Franchise</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From daily operations to strategic insights, our dashboard provides the tools you need to succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track sales, labor costs, and performance metrics across all locations in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
                <CardTitle>Role-Based Views</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Customized dashboards for Owners, Managers, and Shift Leads with relevant data.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get automated reports and actionable insights to optimize your operations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 text-secondary mx-auto mb-4" />
                <CardTitle>Multi-Location</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Manage and compare performance across all your Dairy Queen locations.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Operations?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join franchise owners who are already using our dashboard to increase efficiency and profitability.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
