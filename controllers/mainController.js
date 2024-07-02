const employee = require('../model/employee');
const review = require('../model/review');
const user = require('../model/user');
const admin_service = require('../services/adminService');
const review_service = require('../services/reviewService');
const user_service = require('../services/userService');
const common_service = require('../services/commonService');

class MainController{
    constructor(){
        this.review = review;
        this.user = user;
        this.employee = employee;
        this.adminService = admin_service;
        this.reviewService = review_service;
        this.userService = user_service;
        this.commonService = common_service;
    }
}

module.exports = MainController;