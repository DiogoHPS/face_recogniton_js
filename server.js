const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Diretório onde estão os arquivos
const labelsDirectory = path.join(__dirname, 'labels');

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Endpoint para listar pastas
app.get('/api/users', (req, res) => {
  try {
    const folders = fs.readdirSync(labelsDirectory).filter((item) => {
      return fs.statSync(path.join(labelsDirectory, item)).isDirectory();
    });
    res.json(folders);
  } catch (err) {
    console.error('Erro ao listar pastas:', err);
    res.status(500).json({ error: 'Erro ao listar pastas' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
