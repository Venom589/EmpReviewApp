const AdminService = require('../services/adminService');
const ReviewService = require('../services/reviewService');
const UserService = require('../services/userService');
const CommonService = require('../services/commonService');


class AdminController {

    async allEmployee(req, res) {
        try {
            const data = await CommonService.allEmployee();
            return res.status(200).json(data);
        } catch (error) {
            console.log("AllEmployee error :: ", error);
            return res.sendStatus(400);
        }
    }
    async selectEmployee(req, res) {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const data = await CommonService.selectEmployee(req.body);
            return res.status(200).json(data);
        } catch (error) {
            console.log("select one employee error :: ", error);
            return res.sendStatus(400);
        }
    }
    async createEmployee(req, res) {
        try {
            if (!req.body.name) {
                throw new Error("Request body not found");
            }
            const data = await AdminService.createEmployee(req.body);
            return res.status(201).json(data);
        } catch (error) {
            console.log("Create employee error :: ", error);
            return res.sendStatus(400);
        }
    }
    async editEmployee(req, res) {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            await AdminService.updateEmployee(req.body);
            return res.sendStatus(200);
        } catch (error) {
            console.log("Edit employee error :: ", error);
            return res.sendStatus(400);
        }
    }
    async deleteEmployee(req, res) {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            await AdminService.deleteEmployee(req.body);
            return res.sendStatus(200);
        } catch (error) {
            console.log("AllEmployee error :: ", error);
            return res.sendStatus(400);
        }
    }
    async addReview(req, res) {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const data = await ReviewService.addReview(req.body);
            return res.status(201).json(data);
        } catch (error) {
            console.log("AddReview error :: ", error);
            return res.sendStatus(400);
        }
    }
    async editReview(req, res) {
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await ReviewService.editReview(req.body);
            return res.sendStatus(200);
        } catch (error) {
            console.log("Edit Review error :: ", error);
            return res.sendStatus(400);
        }
    }
    async deleteReview(req, res) {
        try {
            if (!req.body.review_id) {
                throw new Error("Review id not find");
            }
            await ReviewService.deleteReview(req.body);
            return res.sendStatus(200);
        } catch (error) {
            console.log("Delete review error :: ", error);
            return res.sendStatus(400);
        }
    }
    async replyReview(req, res) {
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await ReviewService.replyReview(req.body);
            return res.sendStatus(200);
        } catch (error) {
            console.log("Reply review error :: ", error);
            return res.sendStatus(400);
        }
    }
    async editReply(req, res) {
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await ReviewService.editReply(req.body);
            return res.sendStatus(200);
        } catch (error) {
            console.log("Edit reply error :: ", error);
            return res.sendStatus(400);
        }
    }
    async allUsers(req, res) {
        try {
            const data = await UserService.allUsers();
            return res.status(200).json(data);
        } catch (error) {
            console.log("All users error :: ", error);
            return res.sendStatus(400);
        }
    }
    async deleteUser(req, res) {
        try {
            if (!req.body.user_id) {
                throw new Error("User id not found :: ")
            }
            await UserService.deleteUser(req.body);
            return res.sendStatus(200);
        } catch (error) {
            console.log("Delete user error :: ", error);
            return res.sendStatus(400);
        }
    }
}

module.exports = new AdminController();