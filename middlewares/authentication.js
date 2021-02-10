const jwt = require('jsonwebtoken');

/*-- Verificar la validez del token --*/
let verifyToken = (req, res, next) => {
   let token = req.get('token');

   try {
      const decoded = jwt.verify(token, process.env.SEED);
      req.usuario = decoded.usuario;

      next();
   } catch (error) {
      res.status(401).json({
         ok: false,
         err: {
            name: 'JsonWebTokenError',
            message: 'Token no Válido',
         },
      });
   }
};

/*-- Verificar el rol del usuario --*/
let verifyRole = (req, res, next) => {
   let usuario = req.usuario;

   if (usuario.role !== 'ADMIN_ROLE') {
      return res.status(401).json({
         ok: false,
         err: {
            message: 'Usuario no es Administrador',
         },
      });
   }

   next();
};

/*-- Verificar la validez del token de las imagenes --*/
let verifyTokenImg = (req, res, next) => {
   let token = req.query.token;

   try {
      const decoded = jwt.verify(token, process.env.SEED);
      req.usuario = decoded.usuario;

      next();
   } catch (error) {
      res.status(401).json({
         ok: false,
         err: {
            name: 'JsonWebTokenError',
            message: 'Token no Válido',
         },
      });
   }
};

module.exports = {
   verifyToken,
   verifyRole,
   verifyTokenImg,
};
