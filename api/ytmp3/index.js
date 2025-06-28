
import yts from "yt-search";
import fetch from "node-fetch";

// Objeto para descarga de audio vía API Oceansaver
const ddownr = {
  download: async (url) => {
    const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data?.success) {
        return await ddownr.cekProgress(data.id);
      }
      throw new Error("Fallo al obtener el audio.");
    } catch (error) {
      throw new Error("Error al contactar con la API.");
    }
  },
  
  cekProgress: async (id) => {
    const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
    let attempts = 0;
    const maxAttempts = 12; // 60 segundos máximo
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(progressUrl);
        const data = await response.json();
        if (data?.success && data.progress === 1000) {
          return data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error("Timeout al procesar el audio");
        }
      }
    }
    throw new Error("Timeout al procesar el audio");
  }
};

// Función para obtener miniatura de mejor calidad
async function obtenerMejorMiniatura(videoId) {
  const opciones = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/default.jpg`
  ];
  
  for (const url of opciones) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return url;
    } catch {}
  }
  
  return opciones[opciones.length - 1];
}

// APIs alternativas para MP3
const alternativeAPIs = [
  {
    name: 'siputzx',
    url: (videoUrl) => `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(videoUrl)}`,
    extractUrl: (data) => data.data?.dl
  },
  {
    name: 'ryzendesu',
    url: (videoUrl) => `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`,
    extractUrl: (data) => data.status === 'tunnel' ? data.url : null
  },
  {
    name: 'exonity',
    url: (videoUrl) => `https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh&url=${encodeURIComponent(videoUrl)}`,
    extractUrl: (data) => data.result?.media?.mp3
  }
];

async function downloadWithAlternatives(videoUrl) {
  // Intentar con API principal primero
  try {
    return await ddownr.download(videoUrl);
  } catch (error) {
    console.log('API principal falló, intentando alternativas...');
  }

  // Intentar con APIs alternativas
  for (const api of alternativeAPIs) {
    try {
      const response = await fetch(api.url(videoUrl));
      const data = await response.json();
      const downloadUrl = api.extractUrl(data);
      
      if (downloadUrl) {
        return downloadUrl;
      }
    } catch (error) {
      console.log(`API ${api.name} falló:`, error.message);
    }
  }
  
  throw new Error('Todas las APIs fallaron');
}

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
    let { query, url } = req.method === 'GET' ? req.query : req.body;
    
    // Usar query si no hay url
    const searchTerm = url || query;

    if (!searchTerm) {
      return res.status(400).json({ 
        error: 'Parámetro requerido',
        usage: 'GET /api/ytmp3?query=nombre_cancion o GET /api/ytmp3?url=youtube_url',
        examples: [
          '/api/ytmp3?query=Enemy Imagine Dragons',
          '/api/ytmp3?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        ]
      });
    }

    let videoInfo;

    // Si es una URL de YouTube, buscar info específica
    if (searchTerm.includes('youtu')) {
      try {
        const search = await yts({ videoId: searchTerm.split('v=')[1]?.split('&')[0] || searchTerm });
        videoInfo = search;
      } catch {
        // Si falla, hacer búsqueda normal
        const search = await yts(searchTerm);
        if (!search.all.length) {
          return res.status(404).json({ error: 'No se encontraron resultados' });
        }
        videoInfo = search.all[0];
      }
    } else {
      // Búsqueda por nombre
      const search = await yts(searchTerm);
      if (!search.all.length) {
        return res.status(404).json({ error: 'No se encontraron resultados' });
      }
      videoInfo = search.all[0];
    }

    // Obtener miniatura en mejor calidad
    const thumbnailUrl = await obtenerMejorMiniatura(videoInfo.videoId);

    // Intentar descargar el audio
    const audioUrl = await downloadWithAlternatives(videoInfo.url);

    // Preparar respuesta
    const response = {
      success: true,
      video: {
        title: videoInfo.title,
        duration: videoInfo.timestamp,
        views: videoInfo.views,
        author: videoInfo.author?.name || 'Desconocido',
        published: videoInfo.ago || 'Desconocido',
        thumbnail: thumbnailUrl,
        videoId: videoInfo.videoId,
        url: videoInfo.url
      },
      download: {
        type: 'audio',
        format: 'mp3',
        url: audioUrl,
        filename: `${videoInfo.title}.mp3`
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error en API MP3:', error);
    
    if (error.message.includes('No se encontraron resultados')) {
      return res.status(404).json({ error: 'No se encontraron resultados para la búsqueda' });
    }
    
    if (error.message.includes('Timeout')) {
      return res.status(408).json({ error: 'Timeout al procesar el audio' });
    }

    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error al procesar la solicitud'
    });
  }
}
