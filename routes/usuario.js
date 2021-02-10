const { Router } = require('express');

const usuarioController = require('../controllers/usuario');
const { verifyToken, verifyRole } = require('../middlewares/authentication');

const router = Router();

router.get('/usuario', verifyToken, usuarioController.getUsuarios);

router.post(
   '/usuario',
   [verifyToken, verifyRole],
   usuarioController.postUsuario
);

router.delete(
   '/usuario/:id',
   [verifyToken, verifyRole],
   usuarioController.deleteUsuario
);

router.put(
   '/usuario/:id',
   [verifyToken, verifyRole],
   usuarioController.putUsuario
);

module.exports = router;
