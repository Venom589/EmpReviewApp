const main_service = require('./mainService');
const bcrypt = require('bcrypt');

class AdminService extends main_service{
    constructor() {
        super();
    }
    createEmployee = async (data) => {
        try {
            const employee = await this.employee.findOne({
                name: data.name,
                work_group: data.work_group,
                position: data.position
            });
            if (employee != null) {
                throw new Error("Employee Alredy Exist");
            }
            const newEmployee = await this.employee.create({
                name: data.name,
                work_group: data.work_group,
                position: data.position
            });
            return newEmployee;
        } catch (error) {
            console.log("Create employee service error ::",error);
            throw new Error("Create employee service error ::"+ error.message, error);
        }
    }
    updateEmployee = async (data) => {
        try {
            const employee = await this.employee.findById(data.employee_id);
            if (employee == null) {
                throw new Error("Employee not exist :: ")
            }
            let updateEmployee = employee;
            (data.name)? updateEmployee.name = data.name : "";
            (data.work_group)? updateEmployee.work_group = data.work_group : "";
            (data.position)? updateEmployee.position = data.position : "";
            const updatedEmployee = await this.employee.findByIdAndUpdate(employee._id, updateEmployee);
            return updatedEmployee;
        } catch (error) {
            console.log("Update employee service error ::",error);
            throw new Error("Update employee service error ::"+ error.message, error);
        }
    }
    deleteEmployee = async (data) => {
        try {
            const employee = await this.employee.findById(data.employee_id);
            if (employee == null) {
                throw new Error("Employee not exist :: ")
            }
            const userReviews = await this.review.find({ employee_id: employee._id });
            if(userReviews == null){
                await this.employee.findByIdAndDelete(employee._id);
                return;
            }
            const notAnonymousReview = userReviews.filter((reviews) => { reviews.user == "anonymous" });
            for (let items of notAnonymousReview) {
                const user = await this.user.findById(items.user);
                const updateReviewedList = user.reviewed.filter((x) => { x.employee_id == items.employee_id }); 
                await this.user.findByIdAndUpdate(user._id, { reviewed: updateReviewedList });
            }
            await this.review.deleteMany({employee_id:employee._id, user:'anonymous'});
            await this.review.deleteMany({ employee_id: employee._id });
            await this.employee.findByIdAndDelete(employee._id);
        } catch (error) {
            console.log("Delete employee service error ::",error);
            throw new Error("Delete employee service error ::"+ error.message, error);
        }
    }
    adminCreation = async (data) => {
        try {
            const admin = await this.user.find({ role: "admin" });
            if ( admin.length >= 1) {
                throw new Error("Admin already exist");
            }
            const encPassword = await bcrypt.hash(data.password, 15);
            const newUser = {
                name: data.name,
                email: data.email,
                password: encPassword,
                role: data.role
            }
            await this.user.create(newUser);
        } catch (error) {
            console.log("Admin creation service error ::",error);
            throw new Error("Admin creation service error ::"+ error.message, error);
        }
    }
}
module.exports = new AdminService();