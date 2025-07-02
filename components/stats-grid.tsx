"use client"

import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Solicitudes Hoy",
    value: "24,589",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: "fas fa-bolt",
    color: "text-blue-400",
  },
  {
    title: "Total Solicitudes",
    value: "1.2M",
    change: "+8.3%",
    changeType: "positive" as const,
    icon: "fas fa-database",
    color: "text-cyan-400",
  },
  {
    title: "Tasa de Éxito",
    value: "99.8%",
    change: "+0.2%",
    changeType: "positive" as const,
    icon: "fas fa-check-circle",
    color: "text-green-400",
  },
  {
    title: "Tiempo Respuesta",
    value: "320ms",
    change: "-5%",
    changeType: "negative" as const,
    icon: "fas fa-clock",
    color: "text-yellow-400",
  },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm hover:border-slate-600 transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center ${stat.color}`}>
                <i className={stat.icon} />
              </div>
              <div
                className={`text-sm font-medium flex items-center gap-1 ${
                  stat.changeType === "positive" ? "text-green-400" : "text-red-400"
                }`}
              >
                <i className={`fas fa-arrow-${stat.changeType === "positive" ? "up" : "down"} text-xs`} />
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
  )
}
