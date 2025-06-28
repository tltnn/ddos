
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

// Solo para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
