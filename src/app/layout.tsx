import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ColorSchemeScript, MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css" // Added this line
import "@/styles/globals.css"
import { Navigation } from "@/components/layout/navigation"
import { UserNav } from "@/components/layout/user-nav"
import { Notifications } from "@mantine/notifications" // Added this line
export const dynamic = "force-dynamic";

import { AuthProvider } from "@/features/auth/components/auth-provider"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Mikomercio",
  description:
    "Descubre nuestra exclusiva colección de luminarias, lámparas y accesorios eléctricos de alta gama. Diseño minimalista y elegancia premium.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="font-sans antialiased">
        <MantineProvider>
          <Notifications position="top-right" /> {/* Added this line */}
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Navigation userNav={<UserNav />} />
              {children}
            </Suspense>
          </AuthProvider>
          <Analytics />
        </MantineProvider>
      </body>
    </html>
  )
}
