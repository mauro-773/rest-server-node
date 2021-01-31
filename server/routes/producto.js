const express = require('express');
const app = express();
const Producto = require('../models/producto');
const { verifyToken } = require('../middlewares/authentication');
const _ = require('underscore');

app.post('/producto', verifyToken, (req, res) => {
   let body = req.body;
   let producto = new Producto({
      nombre: body.nombre,
      precioUni: body.precioUni,
      descripcion: body.descripcion,
      disponible: body.disponible,
      categoria: body.categoria,
      usuario: req.usuario._id,
   });

   producto.save((err, productoDB) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err,
         });
      }

      if (!productoDB) {
         return res.status(400).json({
            ok: false,
            err,
         });
      }

      res.json({
         ok: true,
         producto: productoDB,
      });
   });
});

app.get('/producto', verifyToken, (req, res) => {
   let limit = req.query.limit || 0;
   limit = Number(limit);

   let desde = req.query.desde || 0;
   desde = Number(desde);

   Producto.find({ disponible: true })
      .skip(desde)
      .limit(limit)
      .populate('usuario', 'nombre email')
      .populate('categoria', 'descripcion')
      .exec((err, productoDB) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err,
            });
         }

         res.json({
            ok: true,
            producto: productoDB,
         });
      });
});

app.get('/producto/:id', verifyToken, (req, res) => {
   let id = req.params.id;

   Producto.findById(id)
      .populate('usuario', 'nombre email')
      .populate('categoria', 'descripcion')
      .exec((err, productoDB) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err,
            });
         }

         if (!productoDB) {
            return res.status(400).json({
               ok: false,
               err: {
                  message: 'El producto no se encontró',
               },
            });
         }

         res.json({
            ok: true,
            producto: productoDB,
         });
      });
});

// Buscar un producto
app.get('/producto/buscar/:termino', verifyToken, (req, res) => {
   let termino = req.params.termino;

   // Hacemos una expresion regular para que la busqueda sea mas flexible
   let regex = new RegExp(termino, 'i');

   Producto.find({ nombre: regex })
      .populate('categoria', 'descripcion')
      .exec((err, productoDB) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err,
            });
         }

         if (!productoDB) {
            return res.status(400).json({
               ok: false,
               err: {
                  message: 'El producto no se encontró',
               },
            });
         }

         res.json({
            ok: true,
            producto: productoDB,
         });
      });
});

app.put('/producto/:id', verifyToken, (req, res) => {
   let id = req.params.id;
   let body = _.pick(req.body, [
      'nombre',
      'precioUni',
      'descripcion',
      'disponible',
      'categoria',
   ]);

   Producto.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, productoDB) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err,
            });
         }

         if (!productoDB) {
            return res.status(400).json({
               ok: false,
               err: {
                  message: 'El producto no se encontró',
               },
            });
         }

         res.json({
            ok: true,
            producto: productoDB,
         });
      }
   );
});

app.delete('/producto/:id', verifyToken, (req, res) => {
   let id = req.params.id;
   let deshabilitado = {
      disponible: false,
   };

   Producto.findByIdAndUpdate(
      id,
      deshabilitado,
      { runValidators: true },
      (err, productoDB) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err,
            });
         }

         if (!productoDB) {
            return res.status(400).json({
               ok: false,
               err: {
                  message: 'El producto no se encontró',
               },
            });
         }

         res.json({
            ok: true,
            message: 'El producto fue deshabilitado con éxito',
         });
      }
   );
});

module.exports = app;
