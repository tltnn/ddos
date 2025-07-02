export interface ApiConfig {
  id: string
  name: string
  description: string
  icon: string
  category: "downloads" | "streaming" | "tools"
  status: "active" | "beta" | "coming-soon" | "maintenance"
  endpoint: string
  methods: string[]
  gradient: string
  features: string[]
  examples: ApiExample[]
  parameters: ApiParameter[]
  testConfig: TestConfig
}

export interface ApiExample {
  type: string
  url: string
  description: string
}

export interface ApiParameter {
  name: string
  type: string
  required: boolean
  description: string
  default?: any
}

export interface TestConfig {
  hasSearch: boolean
  hasUrl: boolean
  hasQuality: boolean
  hasFormat: boolean
  defaultSearch?: string
  defaultUrl?: string
  qualityOptions?: string[]
  formatOptions?: string[]
}

export interface ApiResponse {
  success: boolean
  data?: any
  error?: {
    code: number
    message: string
    details?: string
  }
}

export interface TestRequest {
  api: string
  type: "search" | "url"
  query?: string
  url?: string
  quality?: string
  format?: string
  [key: string]: any
}
