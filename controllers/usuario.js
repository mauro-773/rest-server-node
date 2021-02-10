const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { errorResponse } = require('../helpers/errorResponse');

exports.getUsuarios = async (req, res) => {
   try {
      let desde = req.query.desde || 0;
      desde = Number(desde);

      let limite = req.query.limite || 0;
      limite = Number(limite);

      const usuarios = await Usuario.find(
         { estado: true },
         'nombre email role estado google img'
      )
         .skip(desde)
         .limit(limite);

      const count = await Usuario.countDocuments({ estado: true });

      res.json({
         ok: true,
         usuarios,
         count,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.postUsuario = async (req, res) => {
   try {
      const { body } = req;

      const usuario = new Usuario({
         nombre: body.nombre,
         email: body.email,
         password: bcrypt.hashSync(body.password, 10),
         role: body.role,
      });

      const usuarioDB = await usuario.save();

      res.json({
         ok: true,
         usuario: usuarioDB,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.deleteUsuario = async (req, res) => {
   try {
      const { id } = req.params;
      const nuevoBody = { estado: false };
      let options = { new: true };

      const usuarioDB = await Usuario.findByIdAndUpdate(id, nuevoBody, options);

      if (!usuarioDB) {
         return res.status(400).json({
            ok: false,
            err: { message: 'Usuario no encontrado' },
         });
      }

      res.json({
         ok: true,
         usuario: usuarioDB,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.putUsuario = async (req, res) => {
   try {
      const { id } = req.params;
      const body = _.pick(req.body, [
         'nombre',
         'email',
         'img',
         'role',
         'estado',
      ]);

      let options = {
         new: true,
         runValidators: true,
      };

      const usuarioDB = await Usuario.findByIdAndUpdate(id, body, options);

      res.json({
         ok: true,
         usuario: usuarioDB,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};
