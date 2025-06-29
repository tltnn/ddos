import express from 'express';
import axios from 'axios';
import yts from 'yt-search';

const router = express.Router();

// API OceanSaver helper
const oceanAPI = {
  download: async (url) => {
    const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
    try {
      const res = await axios.get(apiUrl);
      if (res.data?.success) {
        return await oceanAPI.checkProgress(res.data.id);
      }
      throw new Error("Fallo al obtener audio.");
    } catch {
      throw new Error("Error al contactar con OceanSaver API.");
    }
  },
  checkProgress: async (id) => {
    const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
    while (true) {
      const res = await axios.get(progressUrl);
      if (res.data?.success && res.data.progress === 1000) {
        return res.data.download_url;
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

router.get('/', async (req, res) => {
  try {
    const { query, url } = req.query;

    if (!query && !url) {
      return res.status(400).json({
        success: false,
        error: 'Debes proporcionar un parámetro "query" o "url".'
      });
    }

    let video;
    if (url) {
      const result = await yts({ videoId: getVideoID(url) });
      if (!result || !result.title) throw new Error("Video no encontrado.");
      video = result;
    } else {
      const search = await yts(query);
      if (!search.videos.length) {
        return res.status(404).json({
          success: false,
          error: 'No se encontraron resultados.'
        });
      }
      video = search.videos[0];
    }

    const audioUrl = await oceanAPI.download(video.url);

    res.json({
      success: true,
      title: video.title,
      author: video.author.name,
      thumbnail: video.image,
      audioUrl,
    });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Error inesperado.'
    });
  }
});

// Helper para extraer el video ID
function getVideoID(url) {
  const match = url.match(/(?:youtu\.be\/|v=)([^&\n?#]+)/);
  return match ? match[1] : null;
}

export default router;
