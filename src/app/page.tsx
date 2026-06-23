import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Zap, Shield, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6" />
            AI Email Generator
          </Link>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Generate Professional Emails with{" "}
              <span className="text-primary">AI</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create compelling email content in seconds. Choose your tone, set the length, and let AI do the rest.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start Generating <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 bg-muted/50">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Generate professional emails in seconds, not hours. Save time and boost productivity.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multiple Tones</h3>
              <p className="text-muted-foreground">
                Formal, friendly, persuasive, or casual - adapt your message to any audience.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your data is encrypted and never shared. We prioritize your privacy.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">How does the AI generate emails?</h3>
              <p className="text-muted-foreground">
                Our AI uses advanced language models to create professional emails based on your subject, tone, and length preferences.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">Is there a free plan?</h3>
              <p className="text-muted-foreground">
                Yes! Our free plan includes 5 generations per month. Upgrade to Premium for unlimited access.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">Can I customize the generated emails?</h3>
              <p className="text-muted-foreground">
                Absolutely. All generated emails are fully editable. You can tweak them to match your exact needs.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Email Writing?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who save time with AI-powered email generation.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started for Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 AI Email Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
