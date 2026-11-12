
const express = require('express');
const ProdutoController = require('../controllers/ProdutoController');

const router = express.Router();

router.get('/', ProdutoController.listar);
router.get('/:id', ProdutoController.buscarPorId);
router.post('/', ProdutoController.cadastrar);
router.put('/:id', ProdutoController.atualizar);
router.patch('/:id/desativar', ProdutoController.desativar);
router.patch('/:id/ativar', ProdutoController.ativar);

module.exports = router;
