import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ensureDatabaseSchema } from "@/infrastructure/db/setup"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Email Generator",
  description: "Generate professional emails with AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ensure database tables exist in the background (does not block page rendering)
  ensureDatabaseSchema().catch((error) => {
    console.error("Database background setup failed:", error)
  })

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

