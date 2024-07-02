const main_service = require('./mainService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class CommonService extends main_service{
    constructor(){
        super();
    }
    
    login = async(data) =>{
        try {
            let token = null;
            const user = await this.user.findOne({email:data.email});
            if(user == null){
                throw new Error("User not found");
            }
            const passCheck = bcrypt.compare(data.password,user.password);  
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
            const userData = {
                "name":user.name,
                "email":user.email,
                "role":user.role,
                "token":token
            }
            return userData;
        } catch (error) {
            console.log("login service error ::",error);
            throw new Error("login service error ::"+ error.message,error);
        }
    }
    checkUser = async(data) =>{
        try {
            const user = await this.user.findOne({email:data.email});
            if(user == null){
                throw new Error("User not found :: ");
            }
            return user;
        } catch (error) {
            throw new Error("Check user service error ::"+ error.message,error);
        }
    }
    allEmployee = async() =>{
        try {
            const employees = await this.employee.find();
            let allEmployees = [];
            for (let item of employees) {
                allEmployees.push({
                    employee: item,
                    reviews: await this.review.aggregate([
                        {
                            $match: { employee_id: item._id }
                        },
                        {
                            $count: "count"
                        }
                    ])
                });
            }
            return allEmployees;
        } catch (error) {
            console.log("All employee service error ::",error);
            throw new Error("All employee service error ::"+ error.message,error);
        }
    }
    selectEmployee = async (data) => {
        try {
            const employee = await this.employee.findById(data.employee_id);
            if (employee == null) {
                throw new Error("Employee not exist :: ");
            }
            let allReviews = await this.review.aggregate([
                {
                    $match: { employee_id: employee._id }
                },
                {
                    $project: {
                        "_id": 1,
                        "user": 1,
                        "employee_id": 1,
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
            const selectedEmployee = { employee: employee, reviws: allReviews };
            return selectedEmployee;
        } catch (error) {
            console.log("Select one employee service error ::",error);
            throw new Error("Select one employee service error ::"+ error.message, error);
        }
    }
}

module.exports = new CommonService();