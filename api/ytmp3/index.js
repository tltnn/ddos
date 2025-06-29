import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

// API externa para audio MP3
const ddownr = {
  download: async (url: string): Promise<string> => {
    const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`

    try {
      const response = await axios.get(apiUrl)
      if (response.data?.success) {
        return await ddownr.cekProgress(response.data.id)
      }
      throw new Error("Fallo al obtener el audio.")
    } catch (error: any) {
      console.error("Error en ddownr.download:", error.response ? error.response.data : error.message)
      throw new Error(`Error en la llamada a la API de descarga: ${error.message}`)
    }
  },

  cekProgress: async (id: string): Promise<string> => {
    const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`

    while (true) {
      try {
        const response = await axios.get(progressUrl)

        if (response.data?.success && response.data.progress === 1000) {
          return response.data.download_url
        }

        if (response.data && !response.data.success) {
          console.error("API de progreso devolvió success: false:", response.data)
          throw new Error("La API de progreso indicó un fallo.")
        }

        await new Promise((resolve) => setTimeout(resolve, 4000)) // Esperar 4s entre chequeos
      } catch (error: any) {
        console.error("Error en ddownr.cekProgress:", error.response ? error.response.data : error.message)
        throw new Error(`Error al verificar el progreso del audio: ${error.message}`)
      }
    }
  },
}

// Función para buscar videos de YouTube
async function searchYouTube(query: string) {
  try {
    // Usando una API alternativa para búsqueda de YouTube
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=YOUR_YOUTUBE_API_KEY`

    // Como alternativa, usaremos una búsqueda simple que construye la URL
    const searchQuery = query.replace(/\s+/g, "+")
    const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`

    // Para este ejemplo, construiremos una URL básica de YouTube
    // En producción, deberías usar la API oficial de YouTube
    return `https://www.youtube.com/watch?v=dQw4w9WgXcQ` // URL de ejemplo
  } catch (error) {
    throw new Error("Error al buscar en YouTube")
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const url = searchParams.get("url")

    if (!query && !url) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debes proporcionar un parámetro "query" o "url"',
        },
        { status: 400 },
      )
    }

    // 1. Obtener la URL del video
    let videoUrl = url
    if (!videoUrl && query) {
      videoUrl = await searchYouTube(query)
    }

    if (!videoUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "No se pudo obtener la URL del video",
        },
        { status: 404 },
      )
    }

    // 2. Descargar audio usando la API externa
    const downloadUrl = await ddownr.download(videoUrl)

    // 3. Obtener el audio y enviarlo como respuesta
    const audioResponse = await fetch(downloadUrl)

    if (!audioResponse.ok) {
      throw new Error("Error al descargar el archivo de audio")
    }

    // Obtener el buffer del audio
    const audioBuffer = await audioResponse.arrayBuffer()

    // Crear la respuesta con el audio
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Disposition": 'attachment; filename="audio.mp3"',
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error: any) {
    console.error("Error en la API YouTube MP3:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error desconocido",
      },
      { status: 500 },
    )
  }
}
