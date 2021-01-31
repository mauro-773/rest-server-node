const mongoose = require('mongoose');

const connectDB = async () => {
   try {
      await mongoose.connect(process.env.URLMONGO, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useFindAndModify: false,
         useCreateIndex: true,
      });
      console.log('DB connected');
   } catch (error) {
      console.log(error);
   }
};

module.exports = connectDB;
