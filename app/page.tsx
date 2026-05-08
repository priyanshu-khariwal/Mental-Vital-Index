import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Activity, Brain, TrendingUp, Users, Mic, MessageSquare } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="container max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-5 py-2.5 rounded-full text-sm font-medium text-primary border border-primary/20 shadow-sm">
            <Activity className="w-4 h-4" />
            <span>Mental Health Monitoring System</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
            Track Your Mental Vitality <span className="text-primary">with Voice</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            The Mental Vital Index (MVI) uses natural speech and text analysis to provide personalized insights into
            your mental wellbeing, helping you understand patterns and improve over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              asChild
              className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2 hover:bg-muted/50 bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
          <Card className="border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-4 w-fit border border-blue-500/20">
                <Mic className="w-7 h-7 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Voice Analysis</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Natural 30-60 second voice recordings analyzed for speech patterns, tone, and emotional signals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-2xl p-4 w-fit border border-emerald-500/20">
                <MessageSquare className="w-7 h-7 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Text Analysis</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Optional text-based assessments using natural language processing to understand sentiment and stress
                levels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-4 w-fit border border-purple-500/20">
                <Brain className="w-7 h-7 text-purple-600" />
              </div>
              <CardTitle className="text-xl">MVI Score</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Comprehensive mental vitality score from 0-100 combining multiple analysis signals into one metric
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-2xl p-4 w-fit border border-amber-500/20">
                <TrendingUp className="w-7 h-7 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Trend Tracking</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Monitor changes over time to identify patterns and measure the effectiveness of interventions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 rounded-2xl p-4 w-fit border border-cyan-500/20">
                <Activity className="w-7 h-7 text-cyan-600" />
              </div>
              <CardTitle className="text-xl">Personalized Recommendations</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Receive tailored suggestions for breathing exercises, sleep hygiene, and professional support
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/10 rounded-2xl p-4 w-fit border border-rose-500/20">
                <Users className="w-7 h-7 text-rose-600" />
              </div>
              <CardTitle className="text-xl">Provider Dashboard</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Healthcare professionals can monitor multiple patients and track intervention effectiveness
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-20 border-2 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-4xl mb-3">How It Works</CardTitle>
            <CardDescription className="text-lg">
              Simple, natural, and effective mental health monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-10 md:grid-cols-5 text-center">
              <div className="space-y-4">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-primary/30">
                  1
                </div>
                <h3 className="font-semibold text-lg">Record or Write</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Share 30-60 seconds about how you're feeling
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-primary/30">
                  2
                </div>
                <h3 className="font-semibold text-lg">Analysis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI analyzes speech patterns and content signals
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-primary/30">
                  3
                </div>
                <h3 className="font-semibold text-lg">MVI Score</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Receive your comprehensive mental vitality score
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-primary/30">
                  4
                </div>
                <h3 className="font-semibold text-lg">Recommendations</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get personalized action steps for improvement
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-primary/30">
                  5
                </div>
                <h3 className="font-semibold text-lg">Track Progress</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Monitor trends and celebrate improvements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-10 md:p-16 shadow-2xl shadow-primary/20">
          <h2 className="text-4xl md:text-5xl font-bold mb-5 text-balance">Start Your Mental Vitality Journey Today</h2>
          <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto text-pretty leading-relaxed">
            Join thousands of people taking control of their mental health with data-driven insights
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6"
          >
            <Link href="/auth/sign-up">Create Free Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
