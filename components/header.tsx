"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <div className="mb-8">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSidebar}
        className="lg:hidden mb-4 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 bg-transparent"
      >
        <i className="fas fa-bars" />
      </Button>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Todos los sistemas operativos</Badge>
      </div>

      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
        Dashboard Wapi
      </h1>

      <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
        Potencia tu aplicación con nuestras APIs de descarga y streaming multimedia. Accede a más de 15 plataformas con
        un solo endpoint y gestiona todo desde este dashboard profesional.
      </p>
    </div>
  )
}
