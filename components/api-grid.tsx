
import { ApiCard } from "./api-card"
import type { ApiConfig } from "@/types/api"

interface ApiGridProps {
  apis: ApiConfig[]
  onTestApi: (api: ApiConfig) => void
  onShowDocs: (api: ApiConfig) => void
}

export function ApiGrid({ apis, onTestApi, onShowDocs }: ApiGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {apis.map((api, index) => (
        <ApiCard
          key={api.id}
          api={api}
          onTest={() => onTestApi(api)}
          onShowDocs={() => onShowDocs(api)}
          delay={index * 100}
        />
      ))}
    </div>
  )
}
