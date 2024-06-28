const main_service = require('./mainService');
const bcrypt = require('bcrypt');

class AdminService extends main_service{
    constructor() {
        super();
    }
    CreateEmploye = async (data) => {
        try {
            let checkEmployee = await this.employe.findOne({
                name: data.name,
                work_group: data.work_group,
                position: data.position
            });
            if (checkEmployee != null) {
                throw new Error("Employee Alredy Exist");
            }
            let newEmploye = await this.employe.create({
                name: data.name,
                work_group: data.work_group,
                position: data.position
            });
            return newEmploye;
        } catch (error) {
            throw new Error("Create employe service error ::"+ error.message, error);
        }
    }
    UpdateEmploye = async (data) => {
        try {
            let oneEmploye = await this.employe.findById(data.employe_id);
            if (oneEmploye == null) {
                throw new Error("Employe not exist :: ")
            }
            (data.name) ? oneEmploye.name = data.name : "";
            (data.work_group) ? oneEmploye.work_group = data.work_group : "";
            (data.position) ? oneEmploye.position = data.position : "";
            let updatedEmploye = await this.employe.findByIdAndUpdate(oneEmploye._id, oneEmploye);
            return updatedEmploye;
        } catch (error) {
            throw new Error("Update employe service error ::"+ error.message, error);
        }
    }
    DeleteEmploye = async (data) => {
        try {
            let oneEmploye = await this.employe.findById(data.employe_id);
            if (oneEmploye == null) {
                throw new Error("Employe not exist :: ")
            }
            let userReviews = await this.review.find({ employe_id: oneEmploye._id });
            if(userReviews == null){
                await this.employe.findByIdAndDelete(oneEmploye._id);
                return;
            }
            userReviews = userReviews.filter((reviews) => { reviews.user != "anonymous" });
            for (let items of userReviews) {
                let user = await this.user.findById(items.user);
                user.reviewed = user.reviewed.filter((x) => { x.employe_id != items.employe_id });
                await this.user.findByIdAndUpdate(user._id, { reviewed: user.reviewed });
            }
            await this.review.deleteMany({employe_id:oneEmploye._id, user:'anonymous'});
            await this.review.deleteMany({ employe_id: oneEmploye._id });
            await this.employe.findByIdAndDelete(oneEmploye._id);
        } catch (error) {
            throw new Error("Delete Employee service error ::"+ error.message, error);
        }
    }
    AdminCreation = async (data) => {
        try {
            let findAdmin = await this.user.find({ role: "admin" });
            if ( findAdmin.length >= 1 && findAdmin != null) {
                throw new Error("Admin already exist");
            }
            let encPassword = await bcrypt.hash(data.password, 15);
            let newUser = {
                name: data.name,
                email: data.email,
                password: encPassword,
                role: data.role
            }
            await this.user.create(newUser);
        } catch (error) {
            throw new Error("Admin Creation service error ::"+ error.message, error);
        }
    }
}
module.exports = new AdminService();