const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ffmpeg = require('fluent-ffmpeg');
const stream = require('stream');

// Configuración de FFmpeg (asegúrate de tener ffmpeg instalado en tu sistema)
ffmpeg.setFfmpegPath(require('ffmpeg-static'));

router.get('/', async (req, res) => {
    try {
        const { query, url } = req.query;

        if (!query && !url) {
            return res.status(400).json({ 
                success: false, 
                error: 'Debes proporcionar un parámetro "query" o "url"' 
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

        const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
        if (audioFormats.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'No se encontraron formatos de audio disponibles' 
            });
        }

        const highestQuality = audioFormats.reduce((prev, current) => 
            (prev.bitrate > current.bitrate) ? prev : current
        );

        const title = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '');
        const artist = videoInfo.videoDetails.author.name;
        const thumbnail = videoInfo.videoDetails.thumbnails.slice(-1)[0].url;

        // Configurar headers para la respuesta
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');

        // Stream de audio de YouTube
        const audioStream = ytdl.downloadFromInfo(videoInfo, { format: highestQuality });

        // Convertir a MP3 usando FFmpeg
        const ffmpegCommand = ffmpeg(audioStream)
            .audioBitrate(320)
            .audioCodec('libmp3lame')
            .format('mp3')
            .on('error', (err) => {
                console.error('Error en FFmpeg:', err);
                if (!res.headersSent) {
                    res.status(500).json({ 
                        success: false, 
                        error: 'Error al procesar el audio' 
                    });
                }
            });

        // Pipe al response
        ffmpegCommand.pipe(res, { end: true });

    } catch (error) {
        console.error('Error en la API YouTube MP3:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Error al procesar la solicitud' 
        });
    }
});

module.exports = router;
