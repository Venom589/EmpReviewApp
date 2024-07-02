const Employee = require('../model/employee');
const Review = require('../model/review');
const User = require('../model/user');
const AdminService = require('../services/adminService');
const ReviewService = require('../services/reviewService');
const UserService = require('../services/userService');
const CommonService = require('../services/commonService');

class MainController{
    constructor(){
        this.Review = Review;
        this.User = User;
        this.Employee = Employee;
        this.AdminService = AdminService;
        this.ReviewService = ReviewService;
        this.UserService = UserService;
        this.CommonService = CommonService;
    }
}

module.exports = MainController;