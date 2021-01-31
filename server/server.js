require('./config/config');

const express = require('express');
const connectDB = require('../server/config/dbConfig');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable public folder
app.use(express.static(path.resolve(__dirname, '../public')));

// Routes
app.use(require('./routes/index'));

// Connection to the database
connectDB();

app.listen(process.env.PORT, () => {
   console.log('PORT 4000');
});
