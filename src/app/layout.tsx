import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

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
  // NOTE: database schema is created manually once via supabase/schema.sql.
  // Do NOT auto-initialize the DB from the request runtime — it requires the
  // raw postgres password and a direct TCP connection, which fails (ENETUNREACH)
  // and exhausts the connection pool on serverless hosts like Vercel.
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

