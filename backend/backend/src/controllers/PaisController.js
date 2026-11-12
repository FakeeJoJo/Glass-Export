
const Pais = require('../models/Pais');

class PaisController {
    static async listar(req, res) {
        try {
            const paises = await Pais.listar();

            res.json(paises);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: 'Erro ao listar países.'
            });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const pais = await Pais.buscarPorId(req.params.id);

            if (!pais) {
                return res.status(404).json({
                    mensagem: 'País não encontrado.'
                });
            }

            res.json(pais);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: 'Erro ao buscar país.'
            });
        }
    }

static async desativar(req, res) {
    try {
        const pais = await Pais.buscarPorId(req.params.id);

        if (!pais) {
            return res.status(404).json({
                mensagem: 'País não encontrado.'
            });
        }

        if (!pais.ativo) {
            return res.status(400).json({
                mensagem: 'Este país já está desativado.'
            });
        }

        const paisDesativado = await Pais.desativar(req.params.id);

        res.json({
            mensagem: 'País desativado com sucesso.',
            pais: paisDesativado
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao desativar país.'
        });
    }
}

static async ativar(req, res) {
    try {
        const pais = await Pais.buscarPorId(req.params.id);

        if (!pais) {
            return res.status(404).json({
                mensagem: 'País não encontrado.'
            });
        }

        if (pais.ativo) {
            return res.status(400).json({
                mensagem: 'Este país já está ativo.'
            });
        }

        const paisAtivado = await Pais.ativar(req.params.id);

        res.json({
            mensagem: 'País ativado com sucesso.',
            pais: paisAtivado
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao ativar país.'
        });
    }
}

    static async cadastrar(req, res) {
        try {
            const { nome, codigo_iso, moeda, codigo_moeda } = req.body;

            if (!nome || !codigo_iso || !moeda || !codigo_moeda) {
                return res.status(400).json({
                    mensagem: 'Preencha todos os campos obrigatórios.'
                });
            }

            const pais = new Pais(
                nome,
                codigo_iso,
                moeda,
                codigo_moeda
            );

            const novoPais = await pais.salvar();

            res.status(201).json(novoPais);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: 'Erro ao cadastrar país.'
            });
        }
    }
}

module.exports = PaisController;
