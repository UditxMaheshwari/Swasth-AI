import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import MouseMoveEffect from "@/components/mouse-move-effect"
import "leaflet/dist/leaflet.css"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SwasthAI - Cutting-Edge 3D Healthcare Explanation",
  description: "SwasthAI delivers innovative, high-performance 3D healthcare video solutions for businesses of the future.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <AuthProvider>
          <MouseMoveEffect />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}