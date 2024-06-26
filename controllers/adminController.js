const main_controller = require('./mainController');

class AdminController extends main_controller {
    constructor() {
        super();
    }

    AllEmploye = async (req, res) => {
        try {
            let data = await this.commonService.AllEmploye();
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
    CreateEmploye = async (req, res) => {
        try {
            if (!req.body.name) {
                throw new Error("Request body not found");
            }
            let newEmoloye = await this.adminService.CreateEmploye(req.body);
            res.status(200).json(newEmoloye);
        } catch (error) {
            console.log("Create Employe error :: ", error);
            res.sendStatus(400);
        }
    }
    EditEmploye = async (req, res) => {
        try {
            if (!req.body.employe_id) {
                throw new Error("Employe Id not found ::");
            }
            let data = await this.adminService.UpdateEmploye(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit employe error :: ", error);
            res.sendStatus(400);
        }
    }
    DeleteEmploye = async (req, res) => {
        try {
            if (!req.body.employe_id) {
                throw new Error("Employe Id not found ::");
            }
            await this.adminService.DeleteEmploye(req.body);
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
            let data = await this.reviewService.AddReview(req.body);
            res.status(200).json(newReview);
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
            await this.reviewService.EditReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit Review error :: ", error);
            res.sendStatus(400);
        }
    }
    DeleteReview = async (req, res) => {
        try {
            if (!req.body.review_id) {
                throw new Error("Review id not find");
            }
            await this.reviewService.DeleteReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Delete review error :: ", error);
            res.sendStatus(400);
        }
    }
    ReplyReview = async (req, res) => {
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await this.reviewService.ReplyReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Reply review error :: ", error);
            res.sendStatus(400);
        }
    }
    EditReply = async (req, res) => {
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await this.reviewService.EditReply(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit employe error :: ", error);
            res.sendStatus(400);
        }
    }
    AllUsers = async (req, res) => {
        try {
            let data = await this.userService.AllUsers();
            res.status(200).json(data);
        } catch (error) {
            console.log("AllEmploye error :: ", error);
            res.sendStatus(400);
        }
    }
    DeleteUser = async (req, res) => {
        try {
            if (!req.body.user_id) {
                throw new Error("User id not found :: ")
            }
            await this.userService.DeleteUser(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Delete user error :: ", error);
            res.sendStatus(400);
        }
    }
}

module.exports = new AdminController();