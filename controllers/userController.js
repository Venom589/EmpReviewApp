const UserService = require('../services/userService');
const CommonService = require('../services/commonService');
const ReviewService = require('../services/reviewService');

class UserController {

    async allEmployee(req, res) {
        try {
            const data = await CommonService.allEmployee(req.body);
            return res.status(200).json(data);
        } catch (error) {
            console.log("All employee error :: ", error);
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
    async editName(req, res) {
        try {
            if (!req.body.email) {
                throw new Error("Email is not received :: ");
            }
            await UserService.changeName(req.body);
            return res.sendStatus(200);
        } catch (error) {
            console.log("Edit name error :: ", error);
            return res.sendStatus(400);
        }
    }
    async addReview(req, res) {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const review = await UserService.addReview(req.body);
            return res.status(201).json(review);
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
}

module.exports = new UserController;