
const Produto = require('../models/Produto');

class ProdutoController {
    static async listar(req, res) {
        try {
            const produtos = await Produto.listar();

            res.json(produtos);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: 'Erro ao listar produtos.'
            });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const produto = await Produto.buscarPorId(req.params.id);

            if (!produto) {
                return res.status(404).json({
                    mensagem: 'Produto não encontrado.'
                });
            }

            res.json(produto);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: 'Erro ao buscar produto.'
            });
        }
    }

static async atualizar(req, res) {
    try {
        const { nome, descricao, custo_brl, estoque } = req.body;

        if (!nome || custo_brl === undefined || estoque === undefined ||
            Number(custo_brl) <= 0 || !Number.isInteger(Number(estoque)) ||
            Number(estoque) < 0) {
            return res.status(400).json({
                mensagem: 'Informe dados válidos para atualizar o produto.'
            });
        }

        const produto = await Produto.buscarPorId(req.params.id);

        if (!produto) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        const produtoAtualizado = await Produto.atualizar(req.params.id, {
            nome,
            descricao,
            custo_brl,
            estoque
        });

        res.json(produtoAtualizado);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao atualizar produto.'
        });
    }
}

static async desativar(req, res) {
    try {
        const produto = await Produto.buscarPorId(req.params.id);

        if (!produto) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        if (!produto.ativo) {
            return res.status(400).json({
                mensagem: 'Este produto já está desativado.'
            });
        }

        const produtoDesativado = await Produto.desativar(req.params.id);

        res.json({
            mensagem: 'Produto desativado com sucesso.',
            produto: produtoDesativado
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao desativar produto.'
        });
    }
}

static async ativar(req, res) {
    try {
        const produto = await Produto.buscarPorId(req.params.id);

        if (!produto) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        if (produto.ativo) {
            return res.status(400).json({
                mensagem: 'Este produto já está ativo.'
            });
        }

        const produtoAtivado = await Produto.ativar(req.params.id);

        res.json({
            mensagem: 'Produto ativado com sucesso.',
            produto: produtoAtivado
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao ativar produto.'
        });
    }
}

    static async cadastrar(req, res) {
        try {
            const { nome, descricao, custo_brl, estoque } = req.body;

            if (!nome || custo_brl === undefined || estoque === undefined) {
                return res.status(400).json({
                    mensagem: 'Preencha os campos obrigatórios.'
                });
            }

            const produto = new Produto(
                nome,
                descricao,
                custo_brl,
                estoque
            );

            const novoProduto = await produto.salvar();

            res.status(201).json(novoProduto);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: 'Erro ao cadastrar produto.'
            });
        }
    }
}

module.exports = ProdutoController;
