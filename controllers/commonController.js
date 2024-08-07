const ReviewService = require('../services/reviewService');
const CommonService = require('../services/commonService');

class CommonController {

    async allEmployee(req, res) {
        try {
            const data = await CommonService.allEmployee();
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
    async addReview(req, res) {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            await ReviewService.addAnonymousReview(req.body);
            return res.sendStatus(201);
        } catch (error) {
            console.log("AddReview error :: ", error);
            return res.sendStatus(400);
        }
    }
}

module.exports = new CommonController();