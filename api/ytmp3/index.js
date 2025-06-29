const express = require('express');
const router = express.Router();
const ytsr = require('ytsr');
const axios = require('axios');
const fetch = require('node-fetch');

// API externa para audio MP3
// ¡Aquí estaba el error! Necesitas 'const' para declarar el objeto ddownr.
const ddownr = {
    download: async (url) => {
        const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
        try {
            const response = await axios.get(apiUrl);
            // Si llegamos aquí, la respuesta fue JSON. Loguea el JSON completo si quieres.
            // console.log('Respuesta de download API (éxito):', response.data);
            if (response.data?.success) {
                return await ddownr.cekProgress(response.data.id);
            }
            // Si 'success' es false pero la respuesta es JSON, también lo capturaría
            throw new Error("Fallo al obtener el audio de la API (success: false).");
        } catch (error) {
            // AQUÍ ES DONDE QUEREMOS VER EL CONTENIDO NO-JSON
            console.error('Error en ddownr.download. Respuesta cruda:', error.response ? error.response.data : error.message);
            throw new Error(`Error en la llamada a la API de descarga: ${error.message}.`);
        }
    },
    cekProgress: async (id) => {
        const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
        while (true) {
            try {
                const response = await axios.get(progressUrl);
                // console.log('Respuesta de cekProgress API (éxito):', response.data);
                if (response.data?.success && response.data.progress === 1000) {
                    return response.data.download_url;
                }
                // Aquí podrías añadir una condición para salir del bucle si el progreso no avanza tras X intentos
                // O si 'success' es false en la respuesta de progreso.
                if (response.data && !response.data.success) {
                    console.error('API de progreso devolvió success: false:', response.data);
                    throw new new Error('La API de progreso indicó un fallo.');
                }

                await new Promise(res => setTimeout(res, 4000)); // Esperar 4s
            } catch (error) {
                // Y AQUÍ TAMBIÉN QUEREMOS VER EL CONTENIDO NO-JSON
                console.error('Error en ddownr.cekProgress. Respuesta cruda:', error.response ? error.response.data : error.message);
                throw new Error(`Error al verificar el progreso del audio: ${error.message}.`);
            }
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
        // 1. Obtener la URL del video
        let videoUrl = url;
        if (!videoUrl) {
            const searchResults = await ytsr(query, { limit: 1 });
            const firstResult = searchResults.items?.[0];
            if (!firstResult || firstResult.type !== 'video') {
                return res.status(404).json({
                    success: false,
                    error: 'No se encontró un video válido'
                });
            }
            videoUrl = firstResult.url;
        }
        // 2. Descargar audio usando la API externa
        const downloadUrl = await ddownr.download(videoUrl);
        // 3. Obtener el audio y enviarlo como respuesta
        const audioResponse = await fetch(downloadUrl);
        if (!audioResponse.ok) throw new Error('Error al descargar el archivo de audio');
        res.setHeader('Content-Disposition', `attachment; filename="audio.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');
        audioResponse.body.pipe(res);
    } catch (error) {
        console.error('Error en la API YouTube MP3:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error desconocido'
        });
    }
});
module.exports = router;
