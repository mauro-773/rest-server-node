const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let roles = {
   values: ['ADMIN_ROLE', 'USER_ROLE'],
   message: '{VALUE} no es un rol válido',
};

let usuarioSchema = new Schema({
   nombre: {
      type: String,
      required: [true, 'El nombre es necesario'],
      trim: true,
   },
   email: {
      type: String,
      unique: true,
      required: [true, 'El correo es necesario'],
   },
   password: {
      type: String,
      required: [true, 'La contaseña es necesaria'],
   },
   img: {
      type: String,
      required: false,
   },
   role: {
      type: String,
      default: 'USER_ROLE',
      enum: roles,
   },
   estado: {
      type: Boolean,
      default: true,
   },
   google: {
      type: Boolean,
      default: false,
   },
});

// Evitamos enviar al password como parte del objeto
usuarioSchema.methods.toJSON = function () {
   let user = this;
   let userObj = user.toObject();
   delete userObj.password;

   return userObj;
};

usuarioSchema.plugin(uniqueValidator, {
   message: '{PATH} debe ser único',
});

module.exports = mongoose.model('Usuario', usuarioSchema);
