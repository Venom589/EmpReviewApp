const main_service = require('./mainService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class CommonService extends main_service{
    constructor(){
        super();
    }
    
    Login = async(data) =>{
        try {
            let token = null;
            let user = await this.user.findOne({email:data.email});
            if(user == null){
                throw new Error("User not found");
            }
            let passCheck = bcrypt.compare(data.password,user.password);  
            if(passCheck == false){
                throw new Error("Incorrect Password");
            }
            if(user.role == "admin"){
                token = jwt.sign({user:user.name},process.env.ADMIN_JWT_SECRET,{expiresIn:"1h"});
            }
            if(user.role == "user"){
                token = jwt.sign({user:user.name},process.env.USER_JWT_SECRET,{expiresIn:"1h"});
            }
            if(token == null){
                throw new Error("Token not created :: ");
            }
            let userData = {
                "name":user.name,
                "email":user.email,
                "role":user.role,
                "token":token
            }
            return userData;
        } catch (error) {
            throw new Error("login service error ::"+ error.message,error);
        }
    }
    CheckUser = async(data) =>{
        try {
            let userData = await this.user.findOne({email:data.email});
            if(userData == null){
                throw new Error("User not found :: ");
            }
            return userData;
        } catch (error) {
            throw new Error("login service error ::"+ error.message,error);
        }
    }
    AllEmploye = async() =>{
        try {
            let employees = await this.employe.find();
            let allEmployes = [];
            for (let item of employees) {
                allEmployes.push({
                    employee: item,
                    reviews: await this.review.aggregate([
                        {
                            $match: { employe_id: item._id }
                        },
                        {
                            $count: "users"
                        }
                    ])
                });
            }
            return allEmployes;
        } catch (error) {
            throw new Error("All employe service error ::"+ error.message,error);
        }
    }
    SelectEmploye = async (data) => {
        try {
            let oneEmploye = await this.employe.findById(data.employe_id);
            if (oneEmploye == null) {
                throw new Error("Employe not exist :: ");
            }
            let allReviews = await this.review.aggregate([
                {
                    $match: { employe_id: oneEmploye._id }
                },
                {
                    $project: {
                        "_id": 1,
                        "user": 1,
                        "employe_id": 1,
                        "review": 1,
                        "reply": 1,
                        "created_at": {
                            $dateToString: {
                                date: "$createdAt",
                                format: "%Y-%m-%dT%H:%M:%S",
                                timezone: "Asia/Kolkata"
                            }
                        },
                        "updated_at": {
                            $dateToString: {
                                date: "$updatedAt",
                                format: "%Y-%m-%dT%H:%M:%S",
                                timezone: "Asia/Kolkata"
                            }
                        }
                    }
                }
            ]);
            let selectedEmploye = { employe: oneEmploye, reviws: allReviews };
            return selectedEmploye;
        } catch (error) {
            throw new Error("Select one Employee service error ::"+ error.message, error);
        }
    }
}

module.exports = new CommonService();