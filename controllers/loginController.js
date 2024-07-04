const User = require('../model/user');
const AdminService = require('../services/adminService');
const UserService = require('../services/userService');
const CommonService = require('../services/commonService');
const { roles } = require('../constants/roles');

class LoginController {

    async signup(req, res) {
        try {
            if (!req.body.email) {
                throw new Error("Name not found");
            }
            const user = await User.findOne({ email: req.body.email });
            if (user != null) {
                throw new Error("User with this mail already exist");
            }
            if (req.body.role == roles.ADMIN) {
                await AdminService.adminCreation(req.body);
            }
            if (req.body.role == roles.USER) {
                await UserService.userCreation(req.body);
            }
            return res.sendStatus(201);
        } catch (error) {
            console.log("Sign up error :: ", error);
            return res.sendStatus(400);
        }
    }
    async login(req, res) {
        try {
            if (!req.body.email || !req.body.password ) {
                throw new Error("Request data not received :: ");
            }
            const data = await CommonService.login(req.body);
            return res.status(200).json(data);
        } catch (error) {
            console.log("Login error :: ", error);
            return res.sendStatus(400);
        }
    }
}
module.exports = new LoginController();