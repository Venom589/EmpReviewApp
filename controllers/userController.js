const UserService = require('../services/userService');
const CommonService = require('../services/commonService');
const ReviewService = require('../services/reviewService');

class UserController {

    async allEmployee(req, res) {
        try {
            const data = await CommonService.allEmployee(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("All employee error :: ", error);
            res.sendStatus(400);
        }
    }
    async selectEmployee(req, res) {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const data = await CommonService.selectEmployee(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("select one employee error :: ", error);
            res.sendStatus(400);
        }
    }
    async editName(req, res) {
        try {
            if (!req.body.email) {
                throw new Error("Email is not received :: ");
            }
            await UserService.changeName(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit name error :: ", error);
            res.sendStatus(400);
        }
    }
    async addReview(req, res) {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            const review = await UserService.addReview(req.body);
            res.status(201).json(review);
        } catch (error) {
            console.log("AddReview error :: ", error);
            res.sendStatus(400);
        }
    }
    async editReview(req, res) {
        try {
            if (!req.body.review_id) {
                throw new Error("Review Id not found ::");
            }
            await ReviewService.editReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("Edit Review error :: ", error);
            res.sendStatus(400);
        }
    }
}

module.exports = new UserController;