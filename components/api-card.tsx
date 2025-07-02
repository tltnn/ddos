"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApiConfig } from "@/types/api"

interface ApiCardProps {
  api: ApiConfig
  onTest: () => void
  onShowDocs: () => void
  delay?: number
}

export function ApiCard({ api, onTest, onShowDocs, delay = 0 }: ApiCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      beta: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "coming-soon": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      maintenance: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return colors[status as keyof typeof colors] || colors.active
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      active: "Disponible",
      beta: "Beta",
      "coming-soon": "Próximamente",
      maintenance: "Mantenimiento",
    }
    return labels[status as keyof typeof labels] || "Desconocido"
  }

  const copyEndpoint = () => {
    navigator.clipboard.writeText(api.endpoint)
    // Aquí podrías mostrar una notificación
  }

  return (
    <Card
      id={`api-${api.id}`}
      className={cn(
        "group relative overflow-hidden border-slate-700/50 bg-slate-800/50 backdrop-blur-sm transition-all duration-500 hover:border-slate-600 hover:shadow-xl hover:shadow-blue-500/10",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      )}
    >
      {/* Gradient border */}
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-60", api.gradient)} />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xl transition-transform group-hover:scale-110",
                api.gradient,
              )}
            >
              <i className={api.icon} />
            </div>
            <div>
              <CardTitle className="text-white text-xl">{api.name}</CardTitle>
              <Badge variant="outline" className={cn("mt-1", getStatusColor(api.status))}>
                {getStatusLabel(api.status)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <CardDescription className="text-slate-300 leading-relaxed">{api.description}</CardDescription>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {api.features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600/50">
              {feature}
            </Badge>
          ))}
        </div>

        {/* Endpoint */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{api.methods[0]}</Badge>
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
              onClick={copyEndpoint}
            >
              <i className="fas fa-copy text-xs" />
            </Button>
          </div>
        </div>

        {/* Examples */}
        {api.examples.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-slate-400">Ejemplos</span>
            {api.examples.slice(0, 2).map((example, index) => (
              <div key={index} className="space-y-1">
                <div className="text-xs text-slate-500">{example.description}</div>
                <code className="block bg-slate-900/30 border border-slate-700/30 rounded p-2 text-xs text-slate-300 font-mono overflow-x-auto">
                  {example.url}
                </code>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onTest}
            disabled={api.status === "coming-soon" || api.status === "maintenance"}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            <i className="fas fa-play mr-2" />
            {api.status === "beta" ? "Probar Beta" : "Probar API"}
          </Button>

          <Button
            variant="outline"
            onClick={onShowDocs}
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 bg-transparent"
          >
            <i className="fas fa-book mr-2" />
            Docs
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={copyEndpoint}
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 bg-transparent"
          >
            <i className="fas fa-copy" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
