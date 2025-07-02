import type { ApiConfig } from "@/types/api"

export const apiConfig: ApiConfig[] = [
  {
    id: "ytmp3",
    name: "YouTube MP3",
    description:
      "Convierte videos de YouTube a audio MP3 de alta calidad (hasta 320kbps). Admite búsqueda por término o URL directa con extracción de metadatos.",
    icon: "fas fa-music",
    category: "downloads",
    status: "active",
    endpoint: "/api/v1/ytmp3",
    methods: ["GET"],
    gradient: "from-red-500 to-orange-500",
    features: ["Búsqueda por término", "URL directa", "Metadatos", "Portada"],
    examples: [
      {
        type: "search",
        url: "/api/v1/ytmp3?query=Enemy+Imagine+Dragons&quality=high",
        description: "Búsqueda por término",
      },
      {
        type: "url",
        url: "/api/v1/ytmp3?url=https://www.youtube.com/watch?v=D9G1VOjN_84&format=mp3",
        description: "Por URL directa",
      },
    ],
    parameters: [
      { name: "query", type: "string", required: false, description: "Término de búsqueda" },
      { name: "url", type: "string", required: false, description: "URL de YouTube" },
      { name: "quality", type: "string", required: false, description: "low|medium|high", default: "medium" },
      { name: "format", type: "string", required: false, description: "mp3|mp4", default: "mp3" },
    ],
    testConfig: {
      hasSearch: true,
      hasUrl: true,
      hasQuality: false,
      hasFormat: true,
      defaultSearch: "Enemy Imagine Dragons",
      defaultUrl: "https://www.youtube.com/watch?v=D9G1VOjN_84",
    },
  },
  {
    id: "ytmp4",
    name: "YouTube MP4",
    description:
      "Descarga videos de YouTube en formato MP4 con múltiples calidades (360p, 720p, 1080p, 4K). Soporte para subtítulos y descargas progresivas.",
    icon: "fas fa-film",
    category: "downloads",
    status: "active",
    endpoint: "/api/v1/ytmp4",
    methods: ["GET"],
    gradient: "from-red-600 to-red-500",
    features: ["Múltiples calidades", "Subtítulos", "Audio separado", "Descarga progresiva"],
    examples: [
      {
        type: "url",
        url: "/api/v1/ytmp4?url=https://www.youtube.com/watch?v=D9G1VOjN_84&quality=1080p",
        description: "Descarga en 1080p",
      },
      {
        type: "audio",
        url: "/api/v1/ytmp4?url=https://www.youtube.com/watch?v=D9G1VOjN_84&audioOnly=true",
        description: "Solo audio",
      },
    ],
    parameters: [
      { name: "url", type: "string", required: true, description: "URL de YouTube" },
      { name: "quality", type: "string", required: false, description: "360p|480p|720p|1080p|4k", default: "720p" },
      { name: "audioOnly", type: "boolean", required: false, description: "Solo extraer audio", default: false },
      { name: "subtitles", type: "boolean", required: false, description: "Incluir subtítulos", default: false },
    ],
    testConfig: {
      hasSearch: false,
      hasUrl: true,
      hasQuality: true,
      hasFormat: false,
      defaultUrl: "https://www.youtube.com/watch?v=D9G1VOjN_84",
      qualityOptions: ["360p", "480p", "720p", "1080p", "4k"],
    },
  },
  {
    id: "tiktok",
    name: "TikTok Downloader",
    description:
      "Descarga videos de TikTok sin marca de agua en máxima calidad. Incluye metadatos completos, información del autor y estadísticas.",
    icon: "fab fa-tiktok",
    category: "downloads",
    status: "beta",
    endpoint: "/api/beta/tiktok",
    methods: ["GET"],
    gradient: "from-black to-pink-500",
    features: ["Sin marca de agua", "Metadatos completos", "Info del autor", "Estadísticas"],
    examples: [
      {
        type: "url",
        url: "/api/beta/tiktok?url=https://www.tiktok.com/@user/video/xxx",
        description: "Descarga de TikTok",
      },
    ],
    parameters: [
      { name: "url", type: "string", required: true, description: "URL de TikTok" },
      { name: "hd", type: "boolean", required: false, description: "Calidad HD", default: true },
    ],
    testConfig: {
      hasSearch: false,
      hasUrl: true,
      hasQuality: false,
      hasFormat: false,
      defaultUrl: "https://www.tiktok.com/@example/video/12345",
    },
  },
  {
    id: "instagram",
    name: "Instagram Downloader",
    description:
      "Descarga fotos, videos, historias y reels de Instagram en alta calidad. Soporte para perfiles públicos.",
    icon: "fab fa-instagram",
    category: "downloads",
    status: "coming-soon",
    endpoint: "/api/v1/instagram",
    methods: ["GET"],
    gradient: "from-purple-500 via-pink-500 to-orange-500",
    features: ["Fotos y videos", "Historias", "Reels", "Perfiles públicos"],
    examples: [
      {
        type: "url",
        url: "/api/v1/instagram?url=https://www.instagram.com/p/XXXXXX",
        description: "Descarga de Instagram",
      },
    ],
    parameters: [
      { name: "url", type: "string", required: true, description: "URL de Instagram" },
      { name: "type", type: "string", required: false, description: "post|story|reel", default: "post" },
    ],
    testConfig: {
      hasSearch: false,
      hasUrl: true,
      hasQuality: false,
      hasFormat: false,
      defaultUrl: "https://www.instagram.com/p/XXXXXX",
    },
  },
  {
    id: "spotify",
    name: "Spotify Track Info",
    description:
      "Obtén información detallada de canciones, álbumes y artistas de Spotify. Incluye análisis de audio y recomendaciones.",
    icon: "fab fa-spotify",
    category: "streaming",
    status: "coming-soon",
    endpoint: "/api/v1/spotify",
    methods: ["GET"],
    gradient: "from-green-500 to-green-600",
    features: ["Info de tracks", "Análisis de audio", "Recomendaciones", "Previews"],
    examples: [
      {
        type: "track",
        url: "/api/v1/spotify/track?id=4iV5W9uYEdYUVa79Axb7Rh",
        description: "Información de track",
      },
    ],
    parameters: [
      { name: "id", type: "string", required: true, description: "ID de Spotify" },
      { name: "type", type: "string", required: false, description: "track|album|artist", default: "track" },
    ],
    testConfig: {
      hasSearch: true,
      hasUrl: false,
      hasQuality: false,
      hasFormat: false,
      defaultSearch: "Enemy Imagine Dragons",
    },
  },
  {
    id: "facebook",
    name: "Facebook Video",
    description: "Descarga videos de Facebook en diferentes calidades. Compatible con videos públicos y páginas.",
    icon: "fab fa-facebook",
    category: "streaming",
    status: "coming-soon",
    endpoint: "/api/v1/facebook",
    methods: ["GET"],
    gradient: "from-blue-600 to-blue-700",
    features: ["Videos públicos", "Múltiples calidades", "Páginas", "Grupos públicos"],
    examples: [
      {
        type: "url",
        url: "/api/v1/facebook?url=https://www.facebook.com/xxx/videos/yyy",
        description: "Descarga de Facebook",
      },
    ],
    parameters: [
      { name: "url", type: "string", required: true, description: "URL de Facebook" },
      { name: "quality", type: "string", required: false, description: "low|medium|high", default: "medium" },
    ],
    testConfig: {
      hasSearch: false,
      hasUrl: true,
      hasQuality: true,
      hasFormat: false,
      defaultUrl: "https://www.facebook.com/xxx/videos/yyy",
      qualityOptions: ["low", "medium", "high"],
    },
  },
]

// Función para obtener APIs por categoría
export const getApisByCategory = (category: string) => {
  return apiConfig.filter((api) => api.category === category)
}

// Función para obtener API por ID
export const getApiById = (id: string) => {
  return apiConfig.find((api) => api.id === id)
}

// Función para obtener APIs activas
export const getActiveApis = () => {
  return apiConfig.filter((api) => api.status === "active")
}

// Función para añadir nueva API (para desarrollo)
export const addNewApi = (newApi: ApiConfig) => {
  apiConfig.push(newApi)
}

// Función para remover API (para desarrollo)
export const removeApi = (id: string) => {
  const index = apiConfig.findIndex((api) => api.id === id)
  if (index > -1) {
    apiConfig.splice(index, 1)
  }
}
