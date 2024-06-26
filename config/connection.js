const mongoose = require('mongoose');

var connection;
var trials= 0, maxTrial = 3;
const DB = process.env.DB

console.log("Connecting DB");
const ConnectDb = async() =>{
    try {
        connection= await mongoose.connect(DB);
        console.log("Connected DB");
    } catch (error) {
        if(trials<maxTrial){
            console.log("Connection failed, trying again");
            trials++;
            setTimeout(()=>ConnectDb(),3000);
        }else{
            console.log("Connection failed, max attempt reached");
            process.exit(1);
        }
    }
}

module.exports = ConnectDb();