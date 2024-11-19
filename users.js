const fs = require('fs');
const path = require('path');
// Diretório onde estão as pastas
const baseDirectory = '../face_recogniton_js/labels/';

// Função para listar pastas
 function listarPastas(diretorio) {
    try {
        // Lê o conteúdo do diretório
        const items = fs.readdirSync(diretorio);

        // Filtra apenas os diretórios
        const pastas = items.filter((item) => {
            const itemPath = path.join(diretorio, item);
            return fs.statSync(itemPath).isDirectory();
        });

        return pastas;
    } catch (err) {
        console.error('Erro ao ler o diretório:', err);
        return [];
    }
}

// Obtém as pastas e armazena no array
const userFolders = listarPastas(baseDirectory);

// Exibe as pastas
console.log(userFolders);

module.exports = {
    listarPastas
}