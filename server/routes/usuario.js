const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const { verifyToken, verifyRole } = require('../middlewares/authentication');

app.get('/usuario', verifyToken, (req, res) => {
   let desde = req.query.desde || 0;
   desde = Number(desde);

   let limite = req.query.limite || 0;
   limite = Number(limite);

   Usuario.find({ estado: true }, 'nombre email role estado google img')
      .skip(desde)
      .limit(limite)
      .exec((err, usuarios) => {
         if (err) {
            return res.status(400).json({
               ok: false,
               err,
            });
         }
         Usuario.countDocuments({ estado: true }, (err, cont) => {
            if (err) {
               return res.status(400).json({
                  ok: false,
                  err,
               });
            }
            // Respuesta al front
            res.json({
               ok: true,
               usuarios,
               cout: cont,
            });
         });
      });
});

app.post('/usuario', [verifyToken, verifyRole], (req, res) => {
   let body = req.body;

   let usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      role: body.role,
   });

   usuario.save((err, data) => {
      if (err) {
         return res.status(400).json({
            ok: false,
            err,
         });
      }
      // Respuesta al front
      res.json({
         ok: true,
         usuario: data,
      });
   });
});

app.delete('/usuario/:id', [verifyToken, verifyRole], (req, res) => {
   let id = req.params.id;
   let nuevoBody = {
      estado: false,
   };
   let options = {
      new: true,
   };

   Usuario.findByIdAndUpdate(id, nuevoBody, options, (err, user) => {
      if (err) {
         return res.status(400).json({
            ok: false,
            err,
         });
      }

      if (!user) {
         return res.status(400).json({
            ok: false,
            err: { message: 'Usuario no encontrado' },
         });
      }

      res.json({
         ok: true,
         usuario: user,
      });
   });
});

app.put('/usuario/:id', [verifyToken, verifyRole], (req, res) => {
   let id = req.params.id;
   let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

   let options = {
      new: true,
      runValidators: true,
   };

   Usuario.findByIdAndUpdate(id, body, options, (err, user) => {
      if (err) {
         return res.status(400).json({
            ok: false,
            err,
         });
      }
      res.json({
         ok: true,
         usuario: user,
      });
   });
});

module.exports = app;

// Esta es la manera menos usada de borrar un documente, por lo general se cambian su estado
/*Usuario.findByIdAndRemove(id, (err, userDeleted) => {
   if (err) {
      return res.status(400).json({
         ok: false,
         err,
      });
   }

   if (!userDeleted) {
      return res.status(400).json({
         ok: false,
         err: {
            message: 'Usuario no encontrado',
         },
      });
   }

   res.json({
      ok: true,
      usuario: userDeleted,
   });
});*/
