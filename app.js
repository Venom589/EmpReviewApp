const express = require('express');
const body_parser = require('body-parser'); 
const app = express();
const mainRouter = require('./routers/mainRouter');
const cors = require('cors');

app.use(cors());
app.use(body_parser.urlencoded({extended:true}));
app.use(express.json());
app.use(mainRouter);

module.exports = app;