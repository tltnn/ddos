const axios = require("axios")

// API externa para audio MP3
const ddownr = {
  download: async (url) => {
    const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`

    try {
      console.log("Llamando a la API de descarga:", apiUrl)
      const response = await axios.get(apiUrl)
      console.log("Respuesta de la API de descarga:", response.data)

      if (response.data?.success) {
        // Usar la URL de progreso que devuelve la API
        const progressUrl = response.data.progress_url || `https://p.oceansaver.in/api/progress?id=${response.data.id}`
        return await ddownr.cekProgress(response.data.id, progressUrl)
      }
      throw new Error("Fallo al obtener el audio.")
    } catch (error) {
      console.error("Error en ddownr.download:", error.response ? error.response.data : error.message)
      throw new Error(`Error en la llamada a la API de descarga: ${error.message}`)
    }
  },

  cekProgress: async (id, progressUrl) => {
    console.log("Verificando progreso con URL:", progressUrl)
    let attempts = 0
    const maxAttempts = 30 // Máximo 2 minutos (30 * 4 segundos)

    while (attempts < maxAttempts) {
      try {
        const response = await axios.get(progressUrl)
        console.log(`Intento ${attempts + 1} - Respuesta de progreso:`, response.data)

        if (response.data?.success) {
          // Verificar si el progreso está completo
          if (response.data.progress === 1000 || response.data.progress === "1000") {
            console.log("Descarga completada, URL:", response.data.download_url)
            return response.data.download_url
          }

          // Si hay progreso pero no está completo
          if (response.data.progress) {
            console.log(`Progreso: ${response.data.progress}/1000`)
          }
        } else {
          console.error("API de progreso devolvió success: false:", response.data)
          throw new Error("La API de progreso indicó un fallo.")
        }

        attempts++
        await new Promise((resolve) => setTimeout(resolve, 4000)) // Esperar 4s entre chequeos
      } catch (error) {
        console.error("Error en ddownr.cekProgress:", error.response ? error.response.data : error.message)
        attempts++

        if (attempts >= maxAttempts) {
          throw new Error(
            `Error al verificar el progreso del audio después de ${maxAttempts} intentos: ${error.message}`,
          )
        }

        // Esperar antes del siguiente intento
        await new Promise((resolve) => setTimeout(resolve, 4000))
      }
    }

    throw new Error("Timeout: La descarga tardó demasiado tiempo")
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
      res.setHeader("Content-Type", "application/json")
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
      res.setHeader("Content-Type", "application/json")
      return res.status(404).json({
        success: false,
        error: "No se pudo obtener la URL del video",
      })
    }

    console.log("Procesando URL:", videoUrl)

    // 2. Descargar audio usando la API externa
    const downloadUrl = await ddownr.download(videoUrl)
    console.log("URL de descarga obtenida:", downloadUrl)

    if (!downloadUrl) {
      throw new Error("No se pudo obtener la URL de descarga")
    }

    // 3. Obtener el audio y enviarlo como respuesta
    console.log("Descargando archivo de audio...")
    const audioResponse = await fetch(downloadUrl)

    if (!audioResponse.ok) {
      throw new Error(`Error al descargar el archivo de audio: ${audioResponse.status} ${audioResponse.statusText}`)
    }

    // Verificar que realmente es un archivo de audio
    const contentType = audioResponse.headers.get("content-type")
    console.log("Content-Type del audio:", contentType)

    // Configurar headers para descarga de audio
    res.setHeader("Content-Disposition", 'attachment; filename="audio.mp3"')
    res.setHeader("Content-Type", "audio/mpeg")

    const contentLength = audioResponse.headers.get("content-length")
    if (contentLength) {
      res.setHeader("Content-Length", contentLength)
    }

    // Convertir a buffer y enviar
    const buffer = await audioResponse.arrayBuffer()
    console.log("Tamaño del archivo:", buffer.byteLength, "bytes")

    if (buffer.byteLength === 0) {
      throw new Error("El archivo descargado está vacío")
    }

    res.send(Buffer.from(buffer))
  } catch (error) {
    console.error("Error completo en la API YouTube MP3:", error)

    // Asegurarse de que la respuesta de error sea JSON
    res.setHeader("Content-Type", "application/json")
    res.status(500).json({
      success: false,
      error: error.message || "Error desconocido",
    })
  }
}
