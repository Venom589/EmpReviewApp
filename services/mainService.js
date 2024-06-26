const employe = require('../model/employe');
const review = require('../model/review');
const user = require('../model/user');

class MainService {
    constructor() {
        this.review = review;
        this.user = user;
        this.employe = employe;
    }
}

module.exports = MainService;