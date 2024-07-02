const main_controller = require('./mainController');

class AdminController extends main_controller {
    constructor() {
        super();
    }

    allEmployee = async (req, res) => {
        try {
            const data = await this.commonService.allEmployee();
            res.status(200).json(data);
        } catch (error) {
            console.log("AllEmployee error :: ", error);
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
            console.log("select one Employe error :: ", error);
            res.sendStatus(400);
        }
    }
    createEmployee = async (req, res) => {
        try {
            if (!req.body.name) {
                throw new Error("Request body not found");
            }
            const data = await this.adminService.createEmployee(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("Create employee error :: ", error);
            res.sendStatus(400);
        }
    }
    editEmployee = async (req, res) => {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const data = await this.adminService.updateEmployee(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit employee error :: ", error);
            res.sendStatus(400);
        }
    }
    deleteEmployee = async (req, res) => {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            await this.adminService.deleteEmployee(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("AllEmployee error :: ", error);
            res.sendStatus(400);
        }
    }
    addReview = async (req, res) => {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const data = await this.reviewService.addReview(req.body);
            res.status(200).json(data);
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
            await this.reviewService.editReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit Review error :: ", error);
            res.sendStatus(400);
        }
    }
    deleteReview = async (req, res) => {
        try {
            if (!req.body.review_id) {
                throw new Error("Review id not find");
            }
            await this.reviewService.deleteReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Delete review error :: ", error);
            res.sendStatus(400);
        }
    }
    replyReview = async (req, res) => {
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await this.reviewService.replyReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Reply review error :: ", error);
            res.sendStatus(400);
        }
    }
    editReply = async (req, res) => {
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await this.reviewService.editReply(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit reply error :: ", error);
            res.sendStatus(400);
        }
    }
    allUsers = async (req, res) => {
        try {
            const data = await this.userService.allUsers();
            res.status(200).json(data);
        } catch (error) {
            console.log("All users error :: ", error);
            res.sendStatus(400);
        }
    }
    deleteUser = async (req, res) => {
        try {
            if (!req.body.user_id) {
                throw new Error("User id not found :: ")
            }
            await this.userService.deleteUser(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Delete user error :: ", error);
            res.sendStatus(400);
        }
    }
}

module.exports = new AdminController();