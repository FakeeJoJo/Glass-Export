
const db = require('../config/db');

class Produto {
    constructor(nome, descricao, custo_brl, estoque) {
        this.nome = nome;
        this.descricao = descricao;
        this.custo_brl = custo_brl;
        this.estoque = estoque;
    }

    static async listar() {
        const [produtos] = await db.query(
            'SELECT * FROM produtos'
        );

        return produtos;
    }

    static async buscarPorId(id) {
        const [produto] = await db.query(
            'SELECT * FROM produtos WHERE id = ?',
            [id]
        );

        return produto[0];
    }

static async atualizar(id, dados) {
    await db.query(
        `UPDATE produtos
         SET nome = ?,
             descricao = ?,
             custo_brl = ?,
             estoque = ?
         WHERE id = ?`,
        [
            dados.nome,
            dados.descricao,
            dados.custo_brl,
            dados.estoque,
            id
        ]
    );

    return await Produto.buscarPorId(id);
}

static async desativar(id) {
    await db.query(
        'UPDATE produtos SET ativo = FALSE WHERE id = ?',
        [id]
    );

    return await Produto.buscarPorId(id);
}

static async ativar(id) {
    await db.query(
        'UPDATE produtos SET ativo = TRUE WHERE id = ?',
        [id]
    );

    return await Produto.buscarPorId(id);
}

    async salvar() {
        const [resultado] = await db.query(
            `INSERT INTO produtos
            (nome, descricao, custo_brl, estoque)
            VALUES (?, ?, ?, ?)`,
            [this.nome, this.descricao, this.custo_brl, this.estoque]
        );

        this.id = resultado.insertId;

        return this;
    }
}

module.exports = Produto;
