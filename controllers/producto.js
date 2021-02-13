const _ = require('underscore');

const Producto = require('../models/producto');
const { errorResponse } = require('../helpers/errorResponse');

exports.postProducto = async (req, res) => {
   try {
      let body = req.body;
      let producto = new Producto({
         nombre: body.nombre,
         precioUni: body.precioUni,
         descripcion: body.descripcion,
         disponible: body.disponible,
         categoria: body.categoria,
         usuario: req.usuario._id,
      });

      const productoDB = await producto.save();

      res.json({
         ok: true,
         producto: productoDB,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.getProductos = async (req, res) => {
   try {
      let limit = req.query.limit || 0;
      limit = Number(limit);

      let desde = req.query.desde || 0;
      desde = Number(desde);

      const productos = await Producto.find({ disponible: true })
         .skip(desde)
         .limit(limit)
         .populate('usuario', 'nombre email')
         .populate('categoria', 'descripcion');

      res.json({
         ok: true,
         productos,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.getProducto = async (req, res) => {
   try {
      const { id } = req.params;

      const producto = await Producto.findById(id)
         .populate('usuario', 'nombre email')
         .populate('categoria', 'descripcion');

      if (!producto) {
         return res.status(400).json({
            ok: false,
            err: {
               message: 'El producto no se encontró',
            },
         });
      }

      res.json({
         ok: true,
         producto,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.findProducto = async (req, res) => {
   try {
      const { termino } = req.params;

      // Hacemos una expresion regular para que la busqueda sea mas flexible
      const regex = new RegExp(termino, 'i');

      const producto = await Producto.find({ nombre: regex }).populate(
         'categoria',
         'descripcion'
      );

      if (!producto) {
         return res.status(400).json({
            ok: false,
            err: {
               message: 'El producto no se encontró',
            },
         });
      }

      res.json({
         ok: true,
         producto,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.updateProducto = async (req, res) => {
   try {
      let id = req.params.id;
      let body = _.pick(req.body, [
         'nombre',
         'precioUni',
         'descripcion',
         'disponible',
         'categoria',
      ]);

      const producto = await Producto.findByIdAndUpdate(id, body, {
         new: true,
         runValidators: true,
      });

      if (!producto) {
         return res.status(400).json({
            ok: false,
            err: {
               message: 'El producto no se encontró',
            },
         });
      }

      res.json({
         ok: true,
         producto,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.deleteProducto = async (req, res) => {
   try {
      const { id } = req.params;
      const deshabilitado = {
         disponible: false,
      };

      const producto = await Producto.findByIdAndUpdate(id, deshabilitado, {
         runValidators: true,
      });

      if (!producto) {
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
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};
