const express = require('express');
const router = express.Router();
const ytsr = require('ytsr');
const axios = require('axios');
// const fetch = require('node-fetch'); // <-- ELIMINA ESTA LÍNEA

// Declara la variable fetch globalmente, pero asigna su valor de forma asíncrona
let fetch;

// Función asíncrona auto-ejecutable para cargar módulos ES
(async () => {
    // Importa dinámicamente node-fetch. Obtenemos su exportación por defecto.
    const nodeFetchModule = await import('node-fetch');
    fetch = nodeFetchModule.default;
})();

// API externa para audio MP3
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
            console.error('Error en ddownr.download. Respuesta cruda:', error.response ? error.response.data : error.message);
            throw new Error(`Error en la llamada a la API de descarga: ${error.message}.`);
        }
    },
    cekProgress: async (id) => {
        const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
        while (true) {
            try {
                const response = await axios.get(progressUrl);
                if (response.data?.success && response.data.progress === 1000) {
                    return response.data.download_url;
                }
                if (response.data && !response.data.success) {
                    console.error('API de progreso devolvió success: false:', response.data);
                    throw new Error('La API de progreso indicó un fallo.');
                }
                await new Promise(res => setTimeout(res, 4000)); // Esperar 4s entre chequeos
            } catch (error) {
                console.error('Error en ddownr.cekProgress. Respuesta cruda:', error.response ? error.response.data : error.message);
                throw new Error(`Error al verificar el progreso del audio: ${error.message}.`);
            }
        }
    }
};

router.get('/', async (req, res) => {
    try {
        // Asegúrate de que 'fetch' esté cargado antes de usarlo
        if (!fetch) {
            // Esto, en teoría, no debería ocurrir si la IIFE (función auto-ejecutable)
            // se ejecuta rápidamente. Es una salvaguarda para peticiones extremadamente rápidas
            // o entornos lentos de inicio en frío.
            await new Promise(resolve => {
                const checkFetch = setInterval(() => {
                    if (fetch) {
                        clearInterval(checkFetch);
                        resolve();
                    }
                }, 50); // Comprueba cada 50ms
            });
        }

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
        const audioResponse = await fetch(downloadUrl); // <-- 'fetch' ya está disponible aquí
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
