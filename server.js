const express = require('express');
const fs = require('fs')
const path = require('path')

const app = express();
const port = 8080;

const sdCardPath = '/media/sdcard'; 
const logFileName = 'datalog_sensores.txt';
const fullLogPath = path.join(sdCardPath, logFileName);

app.use(express.json())

app.post('/dados', (req, res) => {
    const { temperatura, umidade, id } = req.body;

    if (temperatura === undefined || umidade === undefined) {
        console.log('Recebida requisição com dados ausentes:', req.body);
        // Envia uma resposta de erro para a BitDogLab
        return res.status(400).send('Erro: Dados de temperatura ou umidade ausentes.');
    }

    // Cria um timestamp no formato padrão ISO (ex: 2025-10-02T17:45:00.123Z)
    const timestamp = new Date().toISOString();

    // Formata a linha que será salva no arquivo (formato CSV: data,id,temp,umidade)
    const logLine = `${timestamp},${deviceId || 'desconhecido'},${temperatura},${umidade}\n`;

    fs.appendFile(fullLogPath, logLine, (err) => {
        if (err) {
            // Se houver um erro ao escrever no arquivo (ex: cartão SD cheio, permissões erradas)
            console.error('ERRO AO ESCREVER NO ARQUIVO DE LOG:', err);
            return res.status(500).send('Erro interno ao salvar os dados.');
        }

        // Se tudo deu certo, imprime no console da Labrador e envia uma resposta de sucesso.
        console.log(`Dados recebidos e salvos: ${logLine.trim()}`);
        res.status(200).send('Dados recebidos com sucesso!');
    });
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});