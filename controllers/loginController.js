const main_controller = require('./mainController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController extends main_controller {
    constructor() {
        super();
    }

    Signup = async (req, res) => {
        try {
            if(!req.body.email){
                throw new Error("Name not found");
            }
            let user = await this.user.findOne({email:req.body.email});
            if(user != null){
                throw new Error("User already exist");
            }
            if(req.body.role == "admin"){
                await this.adminServis.AdminCreation(req.body);
            }
            if(req.body.role == "user"){
                await this.userService.UserCreation(req.body);
            }
            res.sendStatus(200);
        } catch (error) {
            console.log("AllEmploye error :: ", error);
            res.sendStatus(400);
        }
    }
    Login = async (req, res) => {
        try {
            if(!req.body.email || !req.body.password || !req.body.role){
                throw new Error("Request data not received :: ");
            }
            console.log(req.body);
            let data = await this.commonService.Login(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("Login error :: ", error);
            res.sendStatus(400);
        }
    }
    //left
    Logout = async (req, res) => {
        try {
            // if(req.params.role == "admin"){
                if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer"){
                    jwt.verify(req.headers.authorization.split(" ")[1],process.env.ADMIN_JWT_SECRET
                        ,(err, decoded) => {
                            if(err){throw new Error("token not verified");}
                            decoded.exp;
                            console.log(decoded.exp); 
                        });
                }
            // }
            res.sendStatus(200);
        } catch (error) {
            console.log("AllEmploye error :: ", error);
            res.sendStatus(400);
        }
    }
}
module.exports = new LoginController();