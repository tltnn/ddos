"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useNotification } from "@/components/notification-provider"
import type { ApiConfig } from "@/types/api"

interface TestModalProps {
  api: ApiConfig
  onClose: () => void
}

export function TestModal({ api, onClose }: TestModalProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [queryType, setQueryType] = useState<"search" | "url">("search")
  const [searchTerm, setSearchTerm] = useState(api.testConfig.defaultSearch || "")
  const [url, setUrl] = useState(api.testConfig.defaultUrl || "")
  const [quality, setQuality] = useState("720p")
  const [format, setFormat] = useState("mp3")

  const { showNotification } = useNotification()

  const generateExampleData = () => {
    if (queryType === "search" && api.testConfig.hasSearch) {
      setSearchTerm(api.testConfig.defaultSearch || "Enemy Imagine Dragons")
    } else if (queryType === "url" && api.testConfig.hasUrl) {
      setUrl(api.testConfig.defaultUrl || "")
    }
    showNotification("Datos de ejemplo generados", "success")
  }

  const buildTestUrl = () => {
    const params = new URLSearchParams()

    if (queryType === "search" && searchTerm) {
      params.append("query", searchTerm)
    } else if (queryType === "url" && url) {
      params.append("url", url)
    }

    if (api.testConfig.hasQuality && quality) {
      params.append("quality", quality)
    }

    if (api.testConfig.hasFormat && format) {
      params.append("format", format)
    }

    return `${api.endpoint}?${params.toString()}`
  }

  const executeTest = async () => {
    setLoading(true)
    try {
      const testUrl = buildTestUrl()

      // Simular llamada a la API real
      const response = await fetch(testUrl)
      const data = await response.json()

      setResult({
        success: response.ok,
        status: response.status,
        data: data,
        url: testUrl,
        headers: Object.fromEntries(response.headers.entries()),
      })

      showNotification("Prueba ejecutada correctamente", "success")
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        url: buildTestUrl(),
      })
      showNotification("Error al ejecutar la prueba", "error")
    } finally {
      setLoading(false)
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(buildTestUrl())
    showNotification("URL copiada al portapapeles", "success")
  }

  const generateCurlCommand = () => {
    return `curl -X GET "${window.location.origin}${buildTestUrl()}"`
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <i className={`${api.icon} text-2xl`} />
            Probar {api.name}
            <Badge
              className={api.status === "beta" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}
            >
              {api.status === "beta" ? "Beta" : "Activo"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Test Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(api.testConfig.hasSearch || api.testConfig.hasUrl) && (
              <div className="space-y-2">
                <Label className="text-slate-300">Tipo de consulta</Label>
                <Select value={queryType} onValueChange={(value: "search" | "url") => setQueryType(value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {api.testConfig.hasSearch && <SelectItem value="search">Búsqueda por término</SelectItem>}
                    {api.testConfig.hasUrl && <SelectItem value="url">URL directa</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            )}

            {api.testConfig.hasQuality && (
              <div className="space-y-2">
                <Label className="text-slate-300">Calidad</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {(api.testConfig.qualityOptions || ["360p", "720p", "1080p"]).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {api.testConfig.hasFormat && (
              <div className="space-y-2">
                <Label className="text-slate-300">Formato</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {(api.testConfig.formatOptions || ["mp3", "mp4"]).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Input Fields */}
          {queryType === "search" && api.testConfig.hasSearch && (
            <div className="space-y-2">
              <Label className="text-slate-300">Término de búsqueda</Label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ej: Enemy Imagine Dragons"
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          )}

          {queryType === "url" && api.testConfig.hasUrl && (
            <div className="space-y-2">
              <Label className="text-slate-300">URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={api.testConfig.defaultUrl}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          )}

          {/* URL Preview */}
          <div className="space-y-2">
            <Label className="text-slate-300">URL de prueba</Label>
            <div className="relative">
              <code className="block bg-slate-800 border border-slate-600 rounded p-3 text-sm text-blue-400 font-mono overflow-x-auto">
                {buildTestUrl()}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyUrl}
                className="absolute right-2 top-2 text-slate-400 hover:text-white"
              >
                <i className="fas fa-copy" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={executeTest}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <i className="fas fa-rocket mr-2" />
                  Ejecutar Prueba
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={generateExampleData}
              className="border-slate-600 text-slate-300 bg-transparent"
            >
              <i className="fas fa-magic mr-2" />
              Generar Ejemplo
            </Button>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resultado de la Prueba</h3>

              <Tabs defaultValue="response" className="w-full">
                <TabsList className="bg-slate-800 border-slate-600">
                  <TabsTrigger value="response" className="data-[state=active]:bg-slate-700">
                    Respuesta
                  </TabsTrigger>
                  <TabsTrigger value="headers" className="data-[state=active]:bg-slate-700">
                    Headers
                  </TabsTrigger>
                  <TabsTrigger value="curl" className="data-[state=active]:bg-slate-700">
                    cURL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="response" className="mt-4">
                  <pre className="bg-slate-800 border border-slate-600 rounded p-4 text-sm text-slate-300 overflow-x-auto">
                    {JSON.stringify(result.data || result.error, null, 2)}
                  </pre>
                </TabsContent>

                <TabsContent value="headers" className="mt-4">
                  <pre className="bg-slate-800 border border-slate-600 rounded p-4 text-sm text-slate-300 overflow-x-auto">
                    {result.headers ? JSON.stringify(result.headers, null, 2) : "No headers available"}
                  </pre>
                </TabsContent>

                <TabsContent value="curl" className="mt-4">
                  <div className="relative">
                    <pre className="bg-slate-800 border border-slate-600 rounded p-4 text-sm text-green-400 font-mono overflow-x-auto">
                      {generateCurlCommand()}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(generateCurlCommand())
                        showNotification("Comando cURL copiado", "success")
                      }}
                      className="absolute right-2 top-2 text-slate-400 hover:text-white"
                    >
                      <i className="fas fa-copy" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
