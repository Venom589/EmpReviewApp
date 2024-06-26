const express = require('express');
const dot_env = require('dotenv');
const body_parser = require('body-parser'); 
const app = express();
const main_router = require('./routers/mainRouter'); 
const cors = require('cors');
dot_env.config({path:'./config/config.env'});
console.log("Starting server");
require('./config/connection');

app.use(cors());
app.use(body_parser.urlencoded({extended:true}));
app.use(express.json());
app.use(main_router);


app.listen(process.env.PORT, ()=>console.log("Server running"));