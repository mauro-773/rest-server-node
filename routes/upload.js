const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// Default option
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
   let tipo = req.params.tipo;
   let id = req.params.id;

   if (!req.files) {
      return res.status(400).json({
         ok: false,
         err: {
            message: 'No se ha seleccionado ningún archivo',
         },
      });
   }

   // Validacion de los tipos
   let tipos = ['productos', 'usuarios'];
   if (tipos.indexOf(tipo) < 0) {
      return res.status(200).json({
         ok: false,
         err: {
            message: 'El tipo no es válido',
         },
      });
   }

   // Nombre del input
   let archivo = req.files.archivo;
   let nombreArchivo = archivo.name.split('.');
   let extencion = nombreArchivo[nombreArchivo.length - 1];

   // Validacion de extenciones
   let extensiones = ['png', 'jpg', 'jpeg'];

   if (extensiones.indexOf(extencion) < 0) {
      return res.status(400).json({
         ok: false,
         err: {
            message: 'La extencion no esta permitida',
         },
      });
   }

   // Cambiar el nombre al archivo
   let nuevoNombre = `${id}-${new Date().getMilliseconds()}.${extencion}`;

   // Movemos el archivo subido a la carpeta
   archivo.mv(`uploads/${tipo}/${nuevoNombre}`, (err) => {
      if (err) {
         return res.status(500).json({
            ok: false,
            err,
         });
      }
      // En este punto la imagen ya esta subida
      switch (tipo) {
         case 'usuarios':
            imagenUsuario(id, res, nuevoNombre);
            break;
         case 'productos':
            imagenProducto(id, res, nuevoNombre);
            break;
      }
   });
});

function imagenUsuario(id, res, nuevoNombre) {
   Usuario.findById(id, (err, usuarioDB) => {
      if (err) {
         borraArchivo(nuevoNombre, 'usuarios');
         return res.status(500).json({
            ok: false,
            err,
         });
      }

      if (!usuarioDB) {
         borraArchivo(nuevoNombre, 'usuarios');
         return res.status(400).json({
            ok: false,
            err: {
               message: 'El usuario no existe',
            },
         });
      }

      borraArchivo(usuarioDB.img, 'usuarios');

      usuarioDB.img = nuevoNombre;
      usuarioDB.save((err, usuarioDB) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err,
            });
         }

         res.json({
            ok: true,
            usuario: usuarioDB,
            img: nuevoNombre,
         });
      });
   });
}

function imagenProducto(id, res, nuevoNombre) {
   Producto.findById(id, (err, productoDB) => {
      if (err) {
         borraArchivo(nuevoNombre, 'productos');
         return res.status(500).json({
            ok: false,
            err,
         });
      }

      if (!productoDB) {
         borraArchivo(nuevoNombre, 'productos');
         return res.status(400).json({
            ok: false,
            err: {
               message: 'El producto no existe',
            },
         });
      }

      borraArchivo(productoDB.img, 'productos');

      productoDB.img = nuevoNombre;
      productoDB.save((err, productoDB) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err,
            });
         }

         res.json({
            ok: true,
            producto: productoDB,
            img: nuevoNombre,
         });
      });
   });
}

function borraArchivo(nombreImagen, tipo) {
   let pathUrl = path.resolve(
      __dirname,
      `../../uploads/${tipo}/${nombreImagen}`
   );

   if (fs.existsSync(pathUrl)) {
      fs.unlinkSync(pathUrl);
   }
}

module.exports = app;
