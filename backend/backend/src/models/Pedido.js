
const db = require('../config/db');

class Pedido {
    constructor(produto_id, pais_id, quantidade) {
        this.produto_id = produto_id;
        this.pais_id = pais_id;
        this.quantidade = quantidade;
    }

    static async listar() {
        const [pedidos] = await db.query(`
            SELECT
                pedidos.*,
                produtos.nome AS produto,
                paises.nome AS pais,
                paises.codigo_moeda
            FROM pedidos
            INNER JOIN produtos
                ON pedidos.produto_id = produtos.id
            INNER JOIN paises
                ON pedidos.pais_id = paises.id
            ORDER BY pedidos.data_pedido DESC
        `);

        return pedidos;
    }

    static async buscarPorId(id) {
        const [pedidos] = await db.query(
            'SELECT * FROM pedidos WHERE id = ?',
            [id]
        );

        return pedidos[0];
    }

    async salvar(custo, preco, cambio, precoDestino, conexao = db) {
        const valorTotal = precoDestino * this.quantidade;

        const [resultado] = await conexao.query(`
            INSERT INTO pedidos (
                produto_id,
                pais_id,
                quantidade,
                custo_unitario_brl,
                preco_unitario_brl,
                taxa_cambio,
                preco_unitario_destino,
                valor_total_destino
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            this.produto_id,
            this.pais_id,
            this.quantidade,
            custo,
            preco,
            cambio,
            precoDestino,
            valorTotal
        ]);

        this.id = resultado.insertId;

        return this;
    }
}

module.exports = Pedido;
