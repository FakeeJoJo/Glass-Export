
const db = require('../config/db');
const Pedido = require('../models/Pedido');

class PedidoService {
    static async criarPedido({ produto_id, pais_id, quantidade }) {
        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            // Busca o produto e bloqueia sua linha durante a transação
            const [produtos] = await conexao.query(
                'SELECT * FROM produtos WHERE id = ? AND ativo = TRUE FOR UPDATE',
                [produto_id]
            );

            if (produtos.length === 0) {
                throw new Error('Produto não encontrado ou inativo.');
            }

            // Busca o país de destino
            const [paises] = await conexao.query(
                'SELECT * FROM paises WHERE id = ? AND ativo = TRUE',
                [pais_id]
            );

            if (paises.length === 0) {
                throw new Error('País não encontrado ou inativo.');
            }

            const produto = produtos[0];
            const pais = paises[0];

            // Verifica se existe estoque suficiente
            if (quantidade > produto.estoque) {
                throw new Error(
                    `Estoque insuficiente. Disponível: ${produto.estoque} unidades.`
                );
            }

            // Calcula o preço com 100% de acréscimo
            const custo = Number(produto.custo_brl);
            const precoVenda = custo * 2;

            let cambio = 1;

            // Consulta a cotação quando a moeda não for o real
            if (pais.codigo_moeda !== 'BRL') {
                const moeda = pais.codigo_moeda;

                if (!/^[A-Z]{3}$/.test(moeda)) {
                    throw new Error('Código de moeda inválido.');
                }

                const resposta = await fetch(
                    `https://economia.awesomeapi.com.br/json/last/${moeda}-BRL`
                );

                if (!resposta.ok) {
                    throw new Error('Não foi possível consultar a cotação.');
                }

                const dados = await resposta.json();
                const cotacao = dados[`${moeda}BRL`];

                if (!cotacao || !Number(cotacao.bid)) {
                    throw new Error('Cotação da moeda indisponível.');
                }

                // Converte de reais para a moeda estrangeira
                cambio = 1 / Number(cotacao.bid);
            }

            const precoDestino = precoVenda * cambio;

            // Atualiza o estoque
            await conexao.query(
                'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
                [quantidade, produto_id]
            );

            // Cria e salva o pedido usando a mesma conexão
            const pedido = new Pedido(
                produto_id,
                pais_id,
                quantidade
            );

            await pedido.salvar(
                custo,
                precoVenda,
                cambio,
                precoDestino,
                conexao
            );

            // Confirma as alterações
            await conexao.commit();

            return pedido;

        } catch (erro) {
            // Desfaz todas as alterações em caso de erro
            await conexao.rollback();
            throw erro;

        } finally {
            conexao.release();
        }
    }
}

module.exports = PedidoService;
