
const Pedido = require('../models/Pedido');
const PedidoService = require('../services/PedidoService');

class PedidoController {
    static async listar(req, res) {
        try {
            const pedidos = await Pedido.listar();

            res.json(pedidos);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: 'Erro ao listar pedidos.'
            });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const pedido = await Pedido.buscarPorId(req.params.id);

            if (!pedido) {
                return res.status(404).json({
                    mensagem: 'Pedido não encontrado.'
                });
            }

            res.json(pedido);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: 'Erro ao buscar pedido.'
            });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { produto_id, pais_id, quantidade } = req.body;

            if (
                !produto_id ||
                !pais_id ||
                !Number.isInteger(quantidade) ||
                quantidade <= 0
            ) {
                return res.status(400).json({
                    mensagem: 'Informe um produto, um país e uma quantidade válida.'
                });
            }

            const pedido = await PedidoService.criarPedido({
                produto_id,
                pais_id,
                quantidade
            });

            res.status(201).json(pedido);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: erro.message || 'Erro ao cadastrar pedido.'
            });
        }
    }
}

module.exports = PedidoController;
