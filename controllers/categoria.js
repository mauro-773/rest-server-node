const Categoria = require('../models/categoria');
const { errorResponse } = require('../helpers/errorResponse');

exports.postCategoria = async (req, res) => {
   try {
      const body = req.body;

      let categoria = new Categoria({
         descripcion: body.descripcion,
         usuario: req.usuario._id,
      });

      let categoriaDB = await categoria.save();

      res.json({
         ok: true,
         categoria: categoriaDB,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.getCategorias = async (req, res) => {
   try {
      const count = await Categoria.countDocuments();
      const categorias = await Categoria.find()
         .sort('descripcion')
         .populate('usuario', 'nombre email');

      res.json({
         ok: true,
         categorias,
         count,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.getCategoria = async (req, res) => {
   try {
      const { id } = req.params;

      const categoria = await Categoria.findById(id);

      if (!categoria) {
         return res.status(404).json({
            ok: false,
            err: {
               message: 'categoria no encontrada',
            },
         });
      }

      res.json({
         ok: true,
         categoria,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.updateCategoria = async (req, res) => {
   try {
      const { id } = req.params;
      const { descripcion } = req.body;
      let options = { new: true, runValidators: true };

      const categoria = await Categoria.findByIdAndUpdate(
         id,
         { descripcion },
         options
      );

      if (!categoria) {
         return res.status(404).json({
            ok: false,
            err: {
               message: 'categoria no encontrada',
            },
         });
      }

      res.json({
         ok: true,
         categoria,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};

exports.deleteCategoria = async (req, res) => {
   try {
      const { id } = req.params;

      const categoriaBorrada = await Categoria.findByIdAndRemove(id);

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
         categoriaBorrada,
      });
   } catch (error) {
      console.log(error);
      errorResponse(res, error);
   }
};
