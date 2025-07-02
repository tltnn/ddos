import { type NextRequest, NextResponse } from "next/server"
import { amdl } from "@/lib/amdl-scraper"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")
  const quality = searchParams.get("quality") || "720p"
  const audioOnly = searchParams.get("audioOnly") === "true"

  if (!url) {
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

  try {
    // Si audioOnly es true, usar el endpoint de MP3
    if (audioOnly) {
      const result = await amdl.convert(url, "mp3", "128k", true)

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

      return NextResponse.json({
        success: true,
        data: {
          id: result.result.id,
          title: result.result.title,
          duration: result.result.duration || 0,
          thumbnail: result.result.thumbnail,
          download_url: result.result.download,
          quality: "Audio Only",
          size: "Calculando...",
          audioOnly: true,
          format: "mp3",
        },
      })
    }

    // Para video, usar el scraper de video
    const result = await amdl.convert(url, "mp4", quality, false)

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

    return NextResponse.json({
      success: true,
      data: {
        id: result.result.id,
        title: result.result.title,
        duration: result.result.duration || 0,
        thumbnail: result.result.thumbnail,
        download_url: result.result.download,
        quality: result.result.quality,
        size: "Calculando...",
        audioOnly: false,
        format: result.result.format,
        type: result.result.type,
        // Simular múltiples formatos disponibles
        formats: [{ quality: quality, url: result.result.download, size: "Calculando..." }],
      },
    })
  } catch (error) {
    console.error("Error en ytmp4:", error)
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
