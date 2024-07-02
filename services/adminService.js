const MainService = require('./mainService');
const bcrypt = require('bcrypt');

class AdminService extends MainService{
    constructor() {
        super();
    }
    async createEmployee(data){
        try {
            const employee = await this.Employee.findOne({
                name: data.name,
                work_group: data.work_group,
                position: data.position
            });
            if (employee != null) {
                throw new Error("Employee already Exist");
            }
            const newEmployee = await this.Employee.create({
                name: data.name,
                work_group: data.work_group,
                position: data.position
            });
            return newEmployee;
        } catch (error) {
            console.log("Create employee service error ::",error);
            throw new Error(`Create employee service error ::${error.message}`, error);
        }
    }
    async updateEmployee(data){
        try {
            const employee = await this.Employee.findById(data.employee_id);
            if (employee == null) {
                throw new Error("Employee not exist :: ")
            }
            let updateEmployee = employee;
            (data.name)? updateEmployee.name = data.name : "";
            (data.work_group)? updateEmployee.work_group = data.work_group : "";
            (data.position)? updateEmployee.position = data.position : "";
            await this.Employee.findByIdAndUpdate(employee._id, updateEmployee);
        } catch (error) {
            console.log("Update employee service error ::",error);
            throw new Error(`Update employee service error ::${error.message}`, error);
        }
    }
    async deleteEmployee(data){
        try {
            const employee = await this.Employee.findById(data.employee_id);
            if (employee == null) {
                throw new Error("Employee not exist :: ")
            }
            const userReviews = await this.Review.find({ employee_id: employee._id });
            if(userReviews == null){
                await this.Employee.findByIdAndDelete(employee._id);
                return;
            }
            const notAnonymousReview = userReviews.filter((reviews) => { reviews.user == this.roles.ANONYMOUS });
            for (let items of notAnonymousReview) {
                const user = await this.User.findById(items.user);
                const updateReviewedList = user.reviewed.filter((x) => { x.employee_id == items.employee_id }); 
                await this.User.findByIdAndUpdate(user._id, { reviewed: updateReviewedList });
            }
            await this.Review.deleteMany({employee_id:employee._id, user:this.roles.ANONYMOUS});
            await this.Review.deleteMany({ employee_id: employee._id });
            await this.Employee.findByIdAndDelete(employee._id);
        } catch (error) {
            console.log("Delete employee service error ::",error);
            throw new Error(`Delete employee service error ::${error.message}`, error);
        }
    }
    async adminCreation(data){
        try {
            const admin = await this.User.find({ role: this.roles.ADMIN });
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
            await this.User.create(newUser);
        } catch (error) {
            console.log("Admin creation service error ::",error);
            throw new Error(`Admin creation service error ::${error.message}`, error);
        }
    }
}
module.exports = new AdminService();