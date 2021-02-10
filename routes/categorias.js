const { Router } = require('express');

const categoriaController = require('../controllers/categoria');
const { verifyToken, verifyRole } = require('../middlewares/authentication');

const router = Router();

router.post('/categorias', verifyToken, categoriaController.postCategoria);

router.get('/categorias', verifyToken, categoriaController.getCategorias);

router.get('/categorias/:id', verifyToken, categoriaController.getCategoria);

router.put('/categorias/:id', verifyToken, categoriaController.updateCategoria);

router.delete(
   '/categorias/:id',
   [verifyToken, verifyRole],
   categoriaController.deleteCategoria
);

module.exports = router;
