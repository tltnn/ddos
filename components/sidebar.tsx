
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { ApiConfig } from "@/types/api"

interface SidebarProps {
  apis: ApiConfig[]
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ apis, isOpen, onToggle }: SidebarProps) {
  const [activeSection, setActiveSection] = useState("api-ytmp3")

  const categories = {
    downloads: apis.filter((api) => api.category === "downloads"),
    streaming: apis.filter((api) => api.category === "streaming"),
    tools: apis.filter((api) => api.category === "tools"),
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      beta: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "coming-soon": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      maintenance: "bg-red-500/20 text-red-400 border-red-500/30",
    }

    const labels = {
      active: "Activo",
      beta: "Beta",
      "coming-soon": "Próximo",
      maintenance: "Mantenimiento",
    }

    return (
      <Badge variant="outline" className={cn("text-xs", variants[status as keyof typeof variants])}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const scrollToSection = (apiId: string) => {
    setActiveSection(`api-${apiId}`)
    const element = document.getElementById(`api-${apiId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if (window.innerWidth < 1024) {
      onToggle()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-play-circle text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Wapi</h1>
              <p className="text-xs text-slate-400">Multimedia API</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="p-4 space-y-6">
            {/* Downloads Section */}
            {categories.downloads.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <i className="fas fa-download text-xs" />
                  Descargas
                </h3>
                <div className="space-y-1">
                  {categories.downloads.map((api) => (
                    <Button
                      key={api.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-auto p-3 text-left",
                        activeSection === `api-${api.id}`
                          ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-500"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/50",
                      )}
                      onClick={() => scrollToSection(api.id)}
                    >
                      <i className={cn(api.icon, "text-lg")} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{api.name}</div>
                        <div className="text-xs text-slate-500 truncate">{api.endpoint}</div>
                      </div>
                      {getStatusBadge(api.status)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Streaming Section */}
            {categories.streaming.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <i className="fas fa-stream text-xs" />
                  Streaming
                </h3>
                <div className="space-y-1">
                  {categories.streaming.map((api) => (
                    <Button
                      key={api.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-auto p-3 text-left",
                        activeSection === `api-${api.id}`
                          ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-500"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/50",
                      )}
                      onClick={() => scrollToSection(api.id)}
                    >
                      <i className={cn(api.icon, "text-lg")} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{api.name}</div>
                        <div className="text-xs text-slate-500 truncate">{api.endpoint}</div>
                      </div>
                      {getStatusBadge(api.status)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tools Section */}
            {categories.tools.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <i className="fas fa-tools text-xs" />
                  Herramientas
                </h3>
                <div className="space-y-1">
                  {categories.tools.map((api) => (
                    <Button
                      key={api.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-auto p-3 text-left",
                        activeSection === `api-${api.id}`
                          ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-500"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/50",
                      )}
                      onClick={() => scrollToSection(api.id)}
                    >
                      <i className={cn(api.icon, "text-lg")} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{api.name}</div>
                        <div className="text-xs text-slate-500 truncate">{api.endpoint}</div>
                      </div>
                      {getStatusBadge(api.status)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Tools */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <i className="fas fa-cog text-xs" />
                Sistema
              </h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  <i className="fas fa-chart-bar" />
                  Estadísticas
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  <i className="fas fa-key" />
                  API Keys
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  <i className="fas fa-book" />
                  Documentación
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}
