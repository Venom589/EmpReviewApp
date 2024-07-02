const main_controller = require('./mainController');

class AdminController extends main_controller {
    constructor() {
        super();
    }

    async allEmployee(req, res){
        try {
            const data = await this.CommonService.allEmployee();
            res.status(200).json(data);
        } catch (error) {
            console.log("AllEmployee error :: ", error);
            res.sendStatus(400);
        }
    }
    async selectEmployee(req, res){
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const data = await this.CommonService.selectEmployee(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("select one employee error :: ", error);
            res.sendStatus(400);
        }
    }
    async createEmployee(req, res){
        try {
            if (!req.body.name) {
                throw new Error("Request body not found");
            }
            const data = await this.AdminService.createEmployee(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("Create employee error :: ", error);
            res.sendStatus(400);
        }
    }
    async editEmployee(req, res){
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            await this.AdminService.updateEmployee(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit employee error :: ", error);
            res.sendStatus(400);
        }
    }
    async deleteEmployee(req, res){
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            await this.AdminService.deleteEmployee(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("AllEmployee error :: ", error);
            res.sendStatus(400);
        }
    }
    async addReview(req, res){
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const data = await this.ReviewService.addReview(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("AddReview error :: ", error);
            res.sendStatus(400);
        }
    }
    async editReview(req, res){
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await this.ReviewService.editReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit Review error :: ", error);
            res.sendStatus(400);
        }
    }
    async deleteReview(req, res){
        try {
            if (!req.body.review_id) {
                throw new Error("Review id not find");
            }
            await this.ReviewService.deleteReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Delete review error :: ", error);
            res.sendStatus(400);
        }
    }
    async replyReview(req, res){
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await this.ReviewService.replyReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Reply review error :: ", error);
            res.sendStatus(400);
        }
    }
    async editReply(req, res){
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await this.ReviewService.editReply(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit reply error :: ", error);
            res.sendStatus(400);
        }
    }
    async allUsers(req, res){
        try {
            const data = await this.UserService.allUsers();
            res.status(200).json(data);
        } catch (error) {
            console.log("All users error :: ", error);
            res.sendStatus(400);
        }
    }
    async deleteUser(req, res){
        try {
            if (!req.body.user_id) {
                throw new Error("User id not found :: ")
            }
            await this.UserService.deleteUser(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Delete user error :: ", error);
            res.sendStatus(400);
        }
    }
}

module.exports = new AdminController();