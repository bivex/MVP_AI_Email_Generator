"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Navbar } from "@/components/shared/navbar"
import { EmailTone, EmailLength, TONE_LABELS, LENGTH_LABELS } from "@/domain/value-objects"
import { Copy, Check, Sparkles, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const [subject, setSubject] = useState("")
  const [tone, setTone] = useState<string>(EmailTone.FORMAL)
  const [length, setLength] = useState<string>(EmailLength.MEDIUM)
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, tone, length }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Generation failed")
      }

      const data = await response.json()
      setResult(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Email Generator</h1>
            <p className="text-muted-foreground">
              Create professional emails in seconds with AI
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="bg-card p-6 rounded-lg border space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Enter email subject..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    options={Object.entries(TONE_LABELS).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Length</Label>
                  <Select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    options={Object.entries(LENGTH_LABELS).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading || !subject.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Email
                  </>
                )}
              </Button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-card p-6 rounded-lg border"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Generated Email</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted/50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                {result}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
