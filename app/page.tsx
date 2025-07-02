"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsGrid } from "@/components/stats-grid"
import { ApiGrid } from "@/components/api-grid"
import { TestModal } from "@/components/test-modal"
import { DocsModal } from "@/components/docs-modal"
import { NotificationProvider } from "@/components/notification-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { apiConfig } from "@/config/apis"
import type { ApiConfig } from "@/types/api"

export default function Dashboard() {
  const [selectedApi, setSelectedApi] = useState<ApiConfig | null>(null)
  const [showTestModal, setShowTestModal] = useState(false)
  const [showDocsModal, setShowDocsModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleTestApi = (api: ApiConfig) => {
    setSelectedApi(api)
    setShowTestModal(true)
  }

  const handleShowDocs = (api: ApiConfig) => {
    setSelectedApi(api)
    setShowDocsModal(true)
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Sidebar apis={apiConfig} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 lg:ml-80 p-4 lg:p-8">
            <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <StatsGrid />
            <ApiGrid apis={apiConfig} onTestApi={handleTestApi} onShowDocs={handleShowDocs} />
          </main>

          {showTestModal && selectedApi && <TestModal api={selectedApi} onClose={() => setShowTestModal(false)} />}

          {showDocsModal && selectedApi && <DocsModal api={selectedApi} onClose={() => setShowDocsModal(false)} />}
        </div>
      </NotificationProvider>
    </ThemeProvider>
  )
}
