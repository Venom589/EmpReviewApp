const Employee = require('../model/employee');
const Review = require('../model/review');
const User = require('../model/user');
const { roles } = require('../constants/roles');

class MainService {
    constructor() {
        this.Review = Review;
        this.User = User;
        this.Employee = Employee;
        this.roles = roles;
    }
}

module.exports = MainService;