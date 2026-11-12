
const express = require('express');
const PaisController = require('../controllers/PaisController');

const router = express.Router();

router.get('/', PaisController.listar);
router.get('/:id', PaisController.buscarPorId);
router.post('/', PaisController.cadastrar);
router.patch('/:id/desativar', PaisController.desativar);
router.patch('/:id/ativar', PaisController.ativar);

module.exports = router;
