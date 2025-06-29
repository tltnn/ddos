const axios = require("axios")

// API externa para audio MP3
const ddownr = {
  download: async (url) => {
    const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`

    try {
      const response = await axios.get(apiUrl)
      if (response.data?.success) {
        return await ddownr.cekProgress(response.data.id)
      }
      throw new Error("Fallo al obtener el audio.")
    } catch (error) {
      console.error("Error en ddownr.download:", error.response ? error.response.data : error.message)
      throw new Error(`Error en la llamada a la API de descarga: ${error.message}`)
    }
  },

  cekProgress: async (id) => {
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
      } catch (error) {
        console.error("Error en ddownr.cekProgress:", error.response ? error.response.data : error.message)
        throw new Error(`Error al verificar el progreso del audio: ${error.message}`)
      }
    }
  },
}

// Función para buscar videos de YouTube (simulada)
async function searchYouTube(query) {
  try {
    // Para este ejemplo, construiremos una URL básica de YouTube
    // En producción, deberías usar la API oficial de YouTube
    const searchQuery = query.replace(/\s+/g, "+")
    return `https://www.youtube.com/watch?v=dQw4w9WgXcQ` // URL de ejemplo
  } catch (error) {
    throw new Error("Error al buscar en YouTube")
  }
}

// Handler principal para Vercel
module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  // Manejar preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  try {
    const { query, url } = req.query

    if (!query && !url) {
      return res.status(400).json({
        success: false,
        error: 'Debes proporcionar un parámetro "query" o "url"',
      })
    }

    // 1. Obtener la URL del video
    let videoUrl = url
    if (!videoUrl && query) {
      videoUrl = await searchYouTube(query)
    }

    if (!videoUrl) {
      return res.status(404).json({
        success: false,
        error: "No se pudo obtener la URL del video",
      })
    }

    // 2. Descargar audio usando la API externa
    const downloadUrl = await ddownr.download(videoUrl)

    // 3. Obtener el audio y enviarlo como respuesta
    const audioResponse = await fetch(downloadUrl)

    if (!audioResponse.ok) {
      throw new Error("Error al descargar el archivo de audio")
    }

    // Configurar headers para descarga
    res.setHeader("Content-Disposition", 'attachment; filename="audio.mp3"')
    res.setHeader("Content-Type", "audio/mpeg")

    // Pipe el audio directamente a la respuesta
    const buffer = await audioResponse.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch (error) {
    console.error("Error en la API YouTube MP3:", error)
    res.status(500).json({
      success: false,
      error: error.message || "Error desconocido",
    })
  }
}
