"use client"

import type React from "react"

import { useState } from "react"

// Componente Button simple sin dependencias externas
function Button({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent",
    ghost: "text-gray-300 hover:bg-gray-700 hover:text-white",
  }

  const sizeClasses = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8 text-base",
    icon: "h-10 w-10",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  )
}

// Componente Card simple
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
}

function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-2xl font-semibold leading-none tracking-tight text-white ${className}`}>{children}</h3>
}

function CardDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-slate-400 ${className}`}>{children}</p>
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}

// Componente Badge simple
function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500/20 text-green-400 border-green-500/30 ${className}`}
    >
      {children}
    </div>
  )
}

// APIs de ejemplo
const sampleApis = [
  {
    id: "ytmp3",
    name: "YouTube MP3",
    description: "Convierte videos de YouTube a audio MP3 de alta calidad",
    icon: "fas fa-music",
    status: "active",
    endpoint: "/api/v1/ytmp3",
    gradient: "from-red-500 to-orange-500",
    features: ["Búsqueda por término", "URL directa", "Metadatos", "Portada"],
  },
  {
    id: "ytmp4",
    name: "YouTube MP4",
    description: "Descarga videos de YouTube en formato MP4 con múltiples calidades",
    icon: "fas fa-film",
    status: "active",
    endpoint: "/api/v1/ytmp4",
    gradient: "from-red-600 to-red-500",
    features: ["Múltiples calidades", "Subtítulos", "Audio separado", "Descarga progresiva"],
  },
  {
    id: "tiktok",
    name: "TikTok Downloader",
    description: "Descarga videos de TikTok sin marca de agua en máxima calidad",
    icon: "fab fa-tiktok",
    status: "beta",
    endpoint: "/api/beta/tiktok",
    gradient: "from-black to-pink-500",
    features: ["Sin marca de agua", "Metadatos completos", "Info del autor", "Estadísticas"],
  },
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="p-8">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mb-4">
          <i className="fas fa-bars" />
        </Button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <Badge>Todos los sistemas operativos</Badge>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Dashboard Wapi
        </h1>

        <p className="text-slate-400 text-lg max-w-3xl leading-relaxed mb-8">
          Potencia tu aplicación con nuestras APIs de descarga y streaming multimedia. Accede a más de 15 plataformas
          con un solo endpoint y gestiona todo desde este dashboard profesional.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="px-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Solicitudes Hoy",
              value: "24,589",
              change: "+12.5%",
              icon: "fas fa-bolt",
              color: "text-blue-400",
            },
            {
              title: "Total Solicitudes",
              value: "1.2M",
              change: "+8.3%",
              icon: "fas fa-database",
              color: "text-cyan-400",
            },
            {
              title: "Tasa de Éxito",
              value: "99.8%",
              change: "+0.2%",
              icon: "fas fa-check-circle",
              color: "text-green-400",
            },
            {
              title: "Tiempo Respuesta",
              value: "320ms",
              change: "-5%",
              icon: "fas fa-clock",
              color: "text-yellow-400",
            },
          ].map((stat, index) => (
            <Card key={stat.title} className="hover:border-slate-600 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center ${stat.color}`}
                  >
                    <i className={stat.icon} />
                  </div>
                  <div className="text-sm font-medium flex items-center gap-1 text-green-400">
                    <i className="fas fa-arrow-up text-xs" />
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* API Grid */}
      <div className="px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sampleApis.map((api, index) => (
            <Card
              key={api.id}
              className="group relative overflow-hidden hover:border-slate-600 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500"
            >
              {/* Gradient border */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-60 ${api.gradient}`} />

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xl transition-transform group-hover:scale-110 ${api.gradient}`}
                    >
                      <i className={api.icon} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{api.name}</CardTitle>
                      <Badge className="mt-1">
                        {api.status === "active" ? "Disponible" : api.status === "beta" ? "Beta" : "Próximamente"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <CardDescription className="text-slate-300 leading-relaxed">{api.description}</CardDescription>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {api.features.map((feature, idx) => (
                    <Badge key={idx} className="bg-slate-700/50 text-slate-300 border-slate-600/50">
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Endpoint */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">GET</Badge>
                    <span className="text-sm text-slate-400">Endpoint Principal</span>
                  </div>
                  <div className="relative">
                    <code className="block bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 text-sm text-blue-400 font-mono">
                      {api.endpoint}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-2 h-6 w-6 p-0 text-slate-400 hover:text-white"
                      onClick={() => navigator.clipboard.writeText(api.endpoint)}
                    >
                      <i className="fas fa-copy text-xs" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    disabled={api.status === "coming-soon"}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                  >
                    <i className="fas fa-play mr-2" />
                    {api.status === "beta" ? "Probar Beta" : "Probar API"}
                  </Button>

                  <Button variant="outline">
                    <i className="fas fa-book mr-2" />
                    Docs
                  </Button>

                  <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(api.endpoint)}>
                    <i className="fas fa-copy" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
