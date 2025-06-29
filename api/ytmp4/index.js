const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

router.get('/', async (req, res) => {
    try {
        const { url, quality = '720p', query } = req.query;

        if (!url && !query) {
            return res.status(400).json({ 
                success: false, 
                error: 'Debes proporcionar un parámetro "url" o "query"' 
            });
        }

        let videoInfo;
        
        if (url) {
            // Validar URL de YouTube
            if (!ytdl.validateURL(url)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'URL de YouTube no válida' 
                });
            }
            
            videoInfo = await ytdl.getInfo(url);
        } else {
            // Buscar por query
            const searchResults = await ytsr(query, { limit: 1 });
            if (!searchResults.items || searchResults.items.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No se encontraron resultados' 
                });
            }
            
            const firstResult = searchResults.items[0];
            if (firstResult.type !== 'video') {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No se encontró un video válido' 
                });
            }
            
            videoInfo = await ytdl.getInfo(firstResult.url);
        }

        const title = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '');
        const thumbnail = videoInfo.videoDetails.thumbnails.slice(-1)[0].url;

        // Configurar headers para la respuesta
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        
        // Obtener el formato según la calidad solicitada
        let format;
        if (quality === '360p') {
            format = ytdl.chooseFormat(videoInfo.formats, { 
                quality: '18', // 360p
                filter: 'videoandaudio'
            });
        } else if (quality === '720p') {
            format = ytdl.chooseFormat(videoInfo.formats, { 
                quality: '22', // 720p
                filter: 'videoandaudio'
            });
        } else if (quality === '1080p') {
            format = ytdl.chooseFormat(videoInfo.formats, { 
                quality: '137', // 1080p (video only)
                filter: 'videoonly'
            });
            
            // Si no encontramos 1080p con audio, buscamos el mejor disponible
            if (!format) {
                format = ytdl.chooseFormat(videoInfo.formats, { 
                    quality: 'highestvideo',
                    filter: 'videoonly'
                });
            }
        } else {
            format = ytdl.chooseFormat(videoInfo.formats, { 
                quality: 'highest',
                filter: 'videoandaudio'
            });
        }

        if (!format) {
            return res.status(400).json({ 
                success: false, 
                error: 'No se encontró el formato solicitado' 
            });
        }

        // Stream del video
        ytdl.downloadFromInfo(videoInfo, { format: format })
            .pipe(res)
            .on('error', (err) => {
                console.error('Error al descargar el video:', err);
                if (!res.headersSent) {
                    res.status(500).json({ 
                        success: false, 
                        error: 'Error al descargar el video' 
                    });
                }
            });

    } catch (error) {
        console.error('Error en la API YouTube MP4:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Error al procesar la solicitud' 
        });
    }
});

module.exports = router;
