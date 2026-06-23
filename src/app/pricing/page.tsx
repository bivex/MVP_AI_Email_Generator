"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/shared/navbar"
import { Check, Sparkles, Zap, Crown } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for trying out",
    features: [
      "5 generations per month",
      "Basic tones",
      "Standard email length",
      "Email support",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$19",
    period: "/month",
    description: "For professionals",
    features: [
      "Unlimited generations",
      "All tones available",
      "All length options",
      "Priority support",
      "Export to PDF",
      "Custom templates",
      "Team collaboration",
    ],
    cta: "Upgrade to Premium",
    highlighted: true,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-primary shadow-lg scale-105"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.highlighted ? (
                <Button className="w-full gap-2" size="lg">
                  <Sparkles className="h-4 w-4" />
                  {plan.cta}
                </Button>
              ) : (
                <Button variant="outline" className="w-full" size="lg" disabled>
                  {plan.cta}
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">All plans include a 14-day free trial</span>
          </div>
        </div>
      </main>
    </div>
  )
}
