const main_controller = require('./mainController');

class CommonController extends main_controller {
    constructor() {
        super();
    }
    allEmployee = async (req, res) => {
        try {
            const data = await this.commonService.allEmployee();
            res.status(200).json(data);
        } catch (error) {
            console.log("All employee error :: ", error);
            res.sendStatus(400);
        }
    }
    selectEmployee = async (req, res) => {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employe Id not found ::");
            }
            const data = await this.commonService.selectEmployee(req.body);
            res.status(200).json(data);
        } catch (error) {
            console.log("select one employee error :: ", error);
            res.sendStatus(400);
        }
    }
    addReview = async (req, res) => {
        try {
            if (!req.body.employee_id) {
                throw new Error("Employee Id not found ::");
            }
            await this.reviewService.addAnonymousReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("AddReview error :: ", error);
            res.sendStatus(400);
        }
    }
}

module.exports = new CommonController();