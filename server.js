const app = require('./app');
const dot_env = require('dotenv');

dot_env.config({path:'./config/config.env'});
console.log("Starting server");
require('./config/connection');

app.listen(process.env.PORT, ()=>console.log("Server running"));