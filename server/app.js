const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const PORT = 5000;

// Connect to DB
mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// Requiring routes
const userRout = require('./routes/user');
const privateRout = require('./routes/private');

// Config
app.use(express.json());
app.use('/user', userRout);
app.use('/user', privateRout);
dotenv.config();

app.listen(PORT, () => {
    console.log('server has running');
});