const express = require('express');

const userRouter = require('./routes/userRoutes');

const app = express();

//MIDDLEWARES
app.use(express.json());

// interpret url-encoded queries
app.use(express.urlencoded({ extended: false }));

//ROUTES
app.use('/users', userRouter);

module.exports = app;