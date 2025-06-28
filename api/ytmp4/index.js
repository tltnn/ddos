
import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { url } = req.method === 'GET' ? req.query : req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL es requerida',
        usage: 'GET /api/ytmp4?url=YOUTUBE_URL o POST con {"url": "YOUTUBE_URL"}'
      });
    }

    // Validar que sea una URL de YouTube
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'URL de YouTube inválida' });
    }

    // Obtener información del video
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;

    // Filtrar formatos MP4 con video y audio
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio')
      .filter(format => format.container === 'mp4')
      .map(format => ({
        quality: format.qualityLabel || format.quality,
        url: format.url,
        filesize: format.contentLength,
        fps: format.fps,
        codec: format.codecs
      }))
      .sort((a, b) => {
        const qualityOrder = { '1080p': 4, '720p': 3, '480p': 2, '360p': 1, '240p': 0 };
        return (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0);
      });

    if (formats.length === 0) {
      return res.status(404).json({ error: 'No se encontraron formatos MP4 disponibles' });
    }

    // Respuesta con información del video y enlaces de descarga
    const response = {
      success: true,
      video: {
        title: videoDetails.title,
        duration: videoDetails.lengthSeconds,
        thumbnail: videoDetails.thumbnails[0]?.url,
        author: videoDetails.author.name,
        viewCount: videoDetails.viewCount
      },
      downloads: formats
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error:', error);
    
    if (error.message.includes('Video unavailable')) {
      return res.status(404).json({ error: 'Video no disponible' });
    }
    
    if (error.message.includes('private')) {
      return res.status(403).json({ error: 'Video privado' });
    }

    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
