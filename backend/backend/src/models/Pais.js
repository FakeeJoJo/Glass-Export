const db = require('../config/db');

class Pais {
    constructor(nome, codigo_iso, moeda, codigo_moeda) {
        this.nome = nome;
        this.codigo_iso = codigo_iso;
        this.moeda = moeda;
        this.codigo_moeda = codigo_moeda;
    }

    static async listar() {
        const [paises] = await db.query(
            'SELECT * FROM paises'
        );

        return paises;
    }

    static async buscarPorId(id) {
        const [pais] = await db.query(
            'SELECT * FROM paises WHERE id = ?',
            [id]
        );

        return pais[0];
    }

    static async desativar(id) {
    await db.query(
        'UPDATE paises SET ativo = FALSE WHERE id = ?',
        [id]
    );

    return await Pais.buscarPorId(id);
}

static async ativar(id) {
    await db.query(
        'UPDATE paises SET ativo = TRUE WHERE id = ?',
        [id]
    );

    return await Pais.buscarPorId(id);
}

    async salvar() {
        const [resultado] = await db.query(
            `INSERT INTO paises
            (nome, codigo_iso, moeda, codigo_moeda)
            VALUES (?, ?, ?, ?)`,
            [this.nome, this.codigo_iso, this.moeda, this.codigo_moeda]
        );

        this.id = resultado.insertId;

        return this;
    }
}

module.exports = Pais;