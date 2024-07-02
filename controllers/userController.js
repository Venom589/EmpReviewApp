const main_controller = require('./mainController');

class UserController extends main_controller {
    constructor() {
        super();
    }
    allEmployee = async (req, res) => {
        try {
            const data = await this.commonService.allEmployee(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("All employee error :: ", error);
            res.sendStatus(400);
        }
    }
    selectEmployee = async (req, res) => {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const data = await this.commonService.selectEmployee(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("select one employee error :: ", error);
            res.sendStatus(400);
        }
    }
    editName = async (req, res) => {
        try {
            if (!req.body.email) {
                throw new Error("Email is not received :: ");
            }
            await this.userService.changeName(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit name error :: ", error);
            res.sendStatus(400);
        }
    }
    addReview = async (req, res) => {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const data = await this.userService.addReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("AddReview error :: ", error);
            res.sendStatus(400);
        }
    }
    editReview = async (req, res) => {
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await this.userService.editReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit Review error :: ", error);
            res.sendStatus(400);
        }
    }
}

module.exports = new UserController;