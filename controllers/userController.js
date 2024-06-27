const main_controller = require('./mainController');

class UserController extends main_controller {
    constructor() {
        super();
    }
    AllEmployee = async (req, res) => {
        try {
            let data = await this.commonService.AllEmploye(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("AllEmploye error :: ", error);
            res.sendStatus(400);
        }
    }
    SelectEmploye = async (req, res) => {
        try {
            if (!req.body.employe_id) {
                throw new Error("Employe Id not found ::");
            }
            let data = await this.commonService.SelectEmploye(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("select one Employe error :: ", error);
            res.sendStatus(400);
        }
    }
    EditName = async (req, res) => {
        try {
            if (!req.body.email) {
                throw new Error("Email is not received :: ");
            }
            await this.userService.ChangeName(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("AllEmploye error :: ", error);
            res.sendStatus(400);
        }
    }
    AddReview = async (req, res) => {
        try {
            if (!req.body.employe_id) {
                throw new Error("Employe Id not found ::");
            }
            let data = await this.userService.AddReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("AddReview error :: ", error);
            res.sendStatus(400);
        }
    }
    EditReview = async (req, res) => {
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await this.userService.EditReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit Review error :: ", error);
            res.sendStatus(400);
        }
    }
}

module.exports = new UserController;