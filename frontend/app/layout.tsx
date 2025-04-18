import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { PatientSidebar } from "@/components/patient-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { ChatInterface } from "@/components/chat/chat-interface"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Ataraxis AI - Oncology Assistant</title>
        <meta name="description" content="AI-powered oncology assistant for clinicians" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <PatientSidebar />
              <main className="flex-1 bg-primary-light-yellow w-full overflow-x-hidden">
                <div className="max-w-full">{children}</div>
              </main>
            </div>
            <ChatInterface />
            <Toaster />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
