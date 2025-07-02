"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotification } from "@/components/notification-provider"
import type { ApiConfig } from "@/types/api"

interface DocsModalProps {
  api: ApiConfig
  onClose: () => void
}

export function DocsModal({ api, onClose }: DocsModalProps) {
  const { showNotification } = useNotification()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showNotification("Copiado al portapapeles", "success")
  }

  const generateSuccessResponse = () => {
    return JSON.stringify(
      {
        success: true,
        data: {
          id: "example_id",
          title: "Example Title",
          url: "https://example.com/download/abc123",
          duration: 180,
          quality: "high",
          size: "5.2MB",
        },
      },
      null,
      2,
    )
  }

  const generateErrorResponse = () => {
    return JSON.stringify(
      {
        success: false,
        error: {
          code: 404,
          message: "Resource not found",
          details: "The requested resource could not be found",
        },
      },
      null,
      2,
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <i className="fas fa-book text-2xl text-blue-400" />
            Documentación: {api.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* API Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{api.methods[0]}</Badge>
              <code className="text-blue-400 font-mono">{api.endpoint}</code>
            </div>
            <p className="text-slate-300 leading-relaxed">{api.description}</p>
          </div>

          <Tabs defaultValue="parameters" className="w-full">
            <TabsList className="bg-slate-800 border-slate-600">
              <TabsTrigger value="parameters" className="data-[state=active]:bg-slate-700">
                Parámetros
              </TabsTrigger>
              <TabsTrigger value="examples" className="data-[state=active]:bg-slate-700">
                Ejemplos
              </TabsTrigger>
              <TabsTrigger value="responses" className="data-[state=active]:bg-slate-700">
                Respuestas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="parameters" className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Parámetros de la API</h3>
              <div className="space-y-3">
                {api.parameters.map((param, index) => (
                  <div key={index} className="border border-slate-700 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <code className="text-blue-400 font-mono">{param.name}</code>
                      <Badge variant="outline" className="text-xs">
                        {param.type}
                      </Badge>
                      {param.required && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Requerido</Badge>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{param.description}</p>
                    {param.default && (
                      <p className="text-slate-500 text-xs">
                        Por defecto: <code className="text-slate-400">{param.default}</code>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="examples" className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Ejemplos de Uso</h3>
              <div className="space-y-4">
                {api.examples.map((example, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-slate-300 font-medium">{example.description}</h4>
                    <div className="relative">
                      <pre className="bg-slate-800 border border-slate-600 rounded p-4 text-sm text-green-400 font-mono overflow-x-auto">
                        {example.url}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(example.url)}
                        className="absolute right-2 top-2 text-slate-400 hover:text-white"
                      >
                        <i className="fas fa-copy" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="responses" className="mt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Respuesta Exitosa</h3>
                <div className="relative">
                  <pre className="bg-slate-800 border border-slate-600 rounded p-4 text-sm text-slate-300 overflow-x-auto">
                    {generateSuccessResponse()}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(generateSuccessResponse())}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                  >
                    <i className="fas fa-copy" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Respuesta de Error</h3>
                <div className="relative">
                  <pre className="bg-slate-800 border border-slate-600 rounded p-4 text-sm text-slate-300 overflow-x-auto">
                    {generateErrorResponse()}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(generateErrorResponse())}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                  >
                    <i className="fas fa-copy" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={() => copyToClipboard(JSON.stringify(api, null, 2))}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <i className="fas fa-copy mr-2" />
              Copiar Documentación
            </Button>

            <Button
              variant="outline"
              onClick={() => showNotification("Descarga iniciada (simulación)", "info")}
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <i className="fas fa-download mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
