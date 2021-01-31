const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const { verifyTokenImg } = require('../middlewares/authentication');

app.get('/imagen/:tipo/:img', verifyTokenImg, (req, res) => {
   let tipo = req.params.tipo;
   let img = req.params.img;

   let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

   if (fs.existsSync(pathImg)) {
      res.sendFile(pathImg);
   } else {
      let noImagePath = path.resolve(__dirname, '../assets/not-found.png');
      res.sendFile(noImagePath);
   }
});

module.exports = app;
