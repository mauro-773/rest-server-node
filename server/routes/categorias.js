const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const { verifyToken, verifyRole } = require('../middlewares/authentication');

app.post('/categorias', verifyToken, (req, res) => {
   const body = req.body;

   let categoria = new Categoria({
      descripcion: body.descripcion,
      usuario: req.usuario._id,
   });

   categoria.save((err, categoriaDB) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err,
         });
      }

      if (!categoriaDB) {
         return res.status(401).json({
            ok: false,
            err,
         });
      }

      res.json({
         ok: true,
         categoria: categoriaDB,
      });
   });
});

app.get('/categorias', verifyToken, async (req, res) => {
   let count = await Categoria.countDocuments();

   Categoria.find({})
      .sort('descripcion') // Ordenamos por el campo especificado
      .populate('usuario', 'nombre email') // Verifica si existe la referencia y nos trae la info. Podemos especificar que campo queremos
      .exec((err, categorias) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err,
            });
         }

         res.json({
            ok: true,
            categorias,
            count,
         });
      });
});

app.get('/categorias/:id', verifyToken, (req, res) => {
   let id = req.params.id;

   Categoria.findById(id, (err, categoria) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err,
         });
      }

      if (!categoria) {
         return res.status(404).json({
            ok: false,
            err: {
               message: 'Categoria no encontrada',
            },
         });
      }

      res.json({
         ok: true,
         categoria,
      });
   });
});

app.put('/categorias/:id', verifyToken, (req, res) => {
   let id = req.params.id;
   let nuevaDescripcion = req.body.descripcion;

   Categoria.findByIdAndUpdate(
      id,
      { descripcion: nuevaDescripcion },
      { new: true, runValidators: true },
      (err, categoria) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err,
            });
         }

         if (!categoria) {
            return res.status(404).json({
               ok: false,
               err: {
                  message: 'Categoria no encontrada',
               },
            });
         }

         res.json({
            ok: true,
            categoria,
         });
      }
   );
});

app.delete('/categorias/:id', [verifyToken, verifyRole], (req, res) => {
   let id = req.params.id;

   Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err,
         });
      }

      if (!categoriaBorrada) {
         return res.status(404).json({
            ok: false,
            err: {
               message: 'Categoria no encontrada',
            },
         });
      }

      res.json({
         ok: true,
         categoria: categoriaBorrada,
      });
   });
});

module.exports = app;
