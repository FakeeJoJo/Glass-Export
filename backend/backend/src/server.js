
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const produtoRoutes = require('./routes/ProdutoRoutes');
const paisRoutes = require('./routes/PaisRoutes');
const pedidoRoutes = require('./routes/PedidoRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.get('/teste-rotas', (req, res) => {
    res.send('As rotas estão funcionando!');
});

// Rota inicial
app.get('/', (req, res) => {
    res.send('Glass Export API funcionando!');
});

// Teste de conexão com o banco
app.get('/teste-banco', async (req, res) => {
    try {
        const [resultado] = await db.query('SELECT 1 AS teste');

        res.json({
            mensagem: 'Conexão com MySQL funcionando!',
            resultado
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao conectar ao banco de dados.'
        });
    }
});

// Rotas da API
app.use('/api/produtos', produtoRoutes);
app.use('/api/paises', paisRoutes);
app.use('/api/pedidos', pedidoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
