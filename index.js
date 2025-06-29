// Este archivo es opcional en Vercel pero puede ser útil para pruebas locales
// Vercel automáticamente sirve los archivos de la carpeta api/

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Servir el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Información de la API
app.get('/api', (req, res) => {
  res.json({
    name: 'YouTube MP4 Download API',
    version: '1.0.0',
    endpoints: {
      '/api/ytmp4': {
        method: 'GET or POST',
        description: 'Obtiene enlaces de descarga para videos de YouTube',
        parameters: {
          url: 'URL del video de YouTube'
        },
        example: '/api/ytmp4?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    }
  });
});

// --- ¡AÑADE ESTAS LÍNEAS AQUÍ! ---
// 1. Cargar el router de ytmp3
const ytmp3Router = require('./api/ytmp3/index.js'); // Asegúrate de que esta ruta sea correcta

// 2. Usar el router en una ruta específica (ej. /api/ytmp3)
app.use('/api/ytmp3', ytmp3Router);
// --- FIN DE LAS LÍNEAS A AÑADIR ---


// Solo para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Router ytmp3 montado en http://localhost:${PORT}/api/ytmp3`); // Mensaje de confirmación
  });
}

module.exports = app;
