const employee = require('../model/employee');
const review = require('../model/review');
const user = require('../model/user');

class MainService {
    constructor() {
        this.review = review;
        this.user = user;
        this.employee = employee;
    }
}

module.exports = MainService;