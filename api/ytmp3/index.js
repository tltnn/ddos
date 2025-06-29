const express = require('express');
const router = express.Router();
const axios = require('axios');
const ytsr = require('ytsr');

// OceanSaver API wrapper
const ddownr = {
  download: async (url) => {
    const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
    try {
      const response = await axios.get(apiUrl);
      if (response.data?.success) {
        return await ddownr.cekProgress(response.data.id);
      }
      throw new Error("Fallo al obtener el audio.");
    } catch (error) {
      throw new Error("Error al contactar con la API.");
    }
  },
  cekProgress: async (id) => {
    const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
    while (true) {
      const response = await axios.get(progressUrl);
      if (response.data?.success && response.data.progress === 1000) {
        return response.data.download_url;
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
        error: 'Debes proporcionar un parámetro "query" o "url"'
      });
    }

    let videoUrl = url;

    // Si solo hay query, buscar el primer resultado de YouTube
    if (!url) {
      const searchResults = await ytsr(query, { limit: 1 });
      const firstResult = searchResults.items.find(item => item.type === 'video');
      if (!firstResult) {
        return res.status(404).json({ success: false, error: 'No se encontró un video válido.' });
      }
      videoUrl = firstResult.url;
    }

    // Obtener el enlace de descarga MP3 desde OceanSaver
    const downloadUrl = await ddownr.download(videoUrl);

    // Descargar y redirigir o enviar el archivo directamente
    res.setHeader('Content-Disposition', `attachment; filename="audio.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    const response = await axios.get(downloadUrl, { responseType: 'stream' });
    response.data.pipe(res);

  } catch (error) {
    console.error('Error en la API MP3 con OceanSaver:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al procesar la solicitud.'
    });
  }
});

module.exports = router;
