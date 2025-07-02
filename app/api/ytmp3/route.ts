import { type NextRequest, NextResponse } from "next/server"
import { amdl } from "@/lib/amdl-scraper"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")
  const url = searchParams.get("url")
  const quality = searchParams.get("quality") || "128k"
  const format = searchParams.get("format") || "mp3"

  try {
    const videoUrl = url

    // Si es búsqueda por término, necesitarías implementar búsqueda
    // Por ahora, requerimos URL directa
    if (!videoUrl && query) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 400,
            message: "Búsqueda por término no implementada",
            details: "Por favor proporciona una URL directa de YouTube",
          },
        },
        { status: 400 },
      )
    }

    if (!videoUrl) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 400,
            message: "URL requerida",
            details: "Debe proporcionar una URL de YouTube válida",
          },
        },
        { status: 400 },
      )
    }

    // Mapear calidades del dashboard a las del scraper
    const qualityMap = {
      low: "64k",
      medium: "128k",
      high: "320k",
    }

    const scraperQuality = qualityMap[quality as keyof typeof qualityMap] || quality

    // Usar el scraper para descargar
    const result = await amdl.convert(videoUrl, "mp3", scraperQuality, true)

    if (!result.status) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: result.code,
            message: "Error en la descarga",
            details: result.result.error,
          },
        },
        { status: result.code },
      )
    }

    // Adaptar respuesta al formato del dashboard
    return NextResponse.json({
      success: true,
      data: {
        id: result.result.id,
        title: result.result.title,
        artist: result.result.uploader || "Desconocido",
        duration: result.result.duration || 0,
        thumbnail: result.result.thumbnail,
        download_url: result.result.download,
        quality: result.result.quality,
        size: "Calculando...", // El scraper no devuelve tamaño
        format: result.result.format,
        type: result.result.type,
      },
    })
  } catch (error) {
    console.error("Error en ytmp3:", error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 500,
          message: "Error interno del servidor",
          details: "No se pudo procesar la solicitud",
        },
      },
      { status: 500 },
    )
  }
}
