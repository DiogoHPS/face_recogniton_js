const fs = require('fs');
const path = require('path');

// Função para criar uma nova pasta
function criarPasta(diretorio, nomePasta) {
    const caminhoCompleto = path.join(diretorio, nomePasta);
    
    // Verifica se a pasta já existe
    if (!fs.existsSync(caminhoCompleto)) {
        fs.mkdirSync(caminhoCompleto);
        console.log(`Pasta '${nomePasta}' criada com sucesso em '${diretorio}'`);
    } else {
        console.log(`A pasta '${nomePasta}' já existe em '${diretorio}'`);
    }
}

// Verifica se o script foi chamado com argumentos
if (process.argv.length < 4) {
    console.log('Uso: node criarPasta.js <diretorio> <nomePasta>');
    process.exit(1);
}

// Obtém o diretório e o nome da pasta a partir dos argumentos
const diretorio = process.argv[2];
const nomePasta = process.argv[3];

// Chama a função para criar a pasta
criarPasta(diretorio, nomePasta);