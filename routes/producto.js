const { Router } = require('express');
const router = Router();

const productoController = require('../controllers/producto');
const { verifyToken } = require('../middlewares/authentication');

router.post('/producto', verifyToken, productoController.postProducto);

router.get('/producto', verifyToken, productoController.getProductos);

router.get('/producto/:id', verifyToken, productoController.getProducto);

// Buscar un producto
router.get(
   '/producto/buscar/:termino',
   verifyToken,
   productoController.findProducto
);

router.put('/producto/:id', verifyToken, productoController.updateProducto);

router.delete('/producto/:id', verifyToken, productoController.deleteProducto);

module.exports = router;
