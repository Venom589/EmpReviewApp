const main_controller = require('./mainController');

class CommonController extends main_controller {
    constructor() {
        super();
    }
    AllEmployee = async (req, res) => {
        try {
            let data = this.commonService.AllEmploye();
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
    AddReview = async (req, res) => {
        try {
            if (!req.body.Employe_Id) {
                throw new Error("Employe Id not found ::");
            }
            await this.reviewService.AddAnonymousReview(req.body);
            res.sendStatus(200);
        } catch (error) {
            console.log("AddReview error :: ", error);
            res.sendStatus(400);
        }
    }
}

module.exports = new CommonController();