const main_controller = require('./mainController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController extends main_controller {
    constructor() {
        super();
    }

    async signup(req, res){
        try {
            if(!req.body.email){
                throw new Error("Name not found");
            }
            const user = await this.User.findOne({email:req.body.email});
            if(user != null){
                throw new Error("User with this mail already exist");
            }
            if(req.body.role == "admin"){
                await this.AdminService.adminCreation(req.body);
            }
            if(req.body.role == "user"){
                await this.UserService.userCreation(req.body);
            }
            res.sendStatus(200);
        } catch (error) {
            console.log("Sign up error :: ", error);
            res.sendStatus(400);
        }
    }
    async login(req, res){
        try {
            if(!req.body.email || !req.body.password || !req.body.role){
                throw new Error("Request data not received :: ");
            }
            const data = await this.CommonService.login(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("Login error :: ", error);
            res.sendStatus(400);
        }
    }
}
module.exports = new LoginController();