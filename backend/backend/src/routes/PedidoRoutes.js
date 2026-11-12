
const express = require('express');
const PedidoController = require('../controllers/PedidoController');

const router = express.Router();

router.get('/', PedidoController.listar);
router.get('/:id', PedidoController.buscarPorId);
router.post('/', PedidoController.cadastrar);

module.exports = router;
