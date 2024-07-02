const main_service = require('./mainService');
const bcrypt = require('bcrypt');

class UserService extends main_service {
    constructor(){
        super();
    }
    allUsers = async () => {
        try {
            const users = await this.user.find().select("_id name email role reviewed");
            return users;
        } catch (error) {
            console.log("All user service Error ::",error);
            throw new Error("All user service Error ::"+ error.message,error);
        }
    }
    deleteUser = async (data) => {
        try {
            const deleteUser = await this.user.findById(data.user_id);
            if (deleteUser == null) {
                throw new Error("User not found");
            }
            if (deleteUser.role == "admin") {
                throw new Error("Cannot delete admin user");
            }
            if(deleteUser.reviewed != null || deleteUser.reviewed != undefined){
                await this.review.deleteMany({ user: (String)(deleteUser._id) });
            }
            await this.user.findByIdAndDelete(deleteUser._id);
        } catch (error) {
            console.log("Delete user service Error ::",error);
            throw new Error("Delete user service Error ::"+ error.message,error);
        }
    }
    changeName = async(data)=>{
        try {
            const user = await this.user.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found :: ");
            }
            if (data.name) {
                await this.user.findByIdAndUpdate(user._id, { name: data.name });
            }
        } catch (error) {
            console.log("Change name service error ::", error);
            throw new Error("Change name service error ::"+ error.message, error);
        }
    }
    addReview = async(data)=>{
        try {
            const user = await this.user.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found :: ");
            }
            const employee = await this.employee.findById(data.employee_id);
            if (employee == null) {
                throw new Error("Employee not found :: ");
            }
            const review = await this.review.find({ employee_id: employee._id, user:user._id });
            if (review.length == 3) {
                throw new Error("you have already review 3 time you cannot review now.");
            }
            const reviewData = {
                user: user._id,
                employee_id: employee._id,
                review: data.review,
            }
            if (review.length == 0) {
                let updateUserReviewed = user.reviewed;
                updateUserReviewed.push({
                    employee_id: employee._id
                });
                await this.user.findByIdAndUpdate(user._id, user);
            }
            await this.review.create(reviewData);
        } catch (error) {
            console.log("Add review service error ::",error);
            throw new Error("Add review service error ::"+ error.message, error);
        }
    }
    editReview = async(data)=>{
        try {
            const user = await this.user.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found :: ");
            }
            let review = await this.review.findOne({ _id: data.review_id, user: (String)(user._id) });
            if (review == null) {
                throw new Error("Review not found :: ");
            }
            if (data.review) {
                await this.review.findByIdAndUpdate(review._id, {review:data.review});
            }
        } catch (error) {
            console.log("Edit review service error ::",error);
            throw new Error("Edit review service error ::"+ error.message, error);
        }
    }
    userCreation = async(data) =>{
        try {
            const encPassword = await bcrypt.hash(data.password, 15);
            const newUser = {
                name: data.name,
                email: data.email,
                password: encPassword,
                role: data.role
            }
            await this.user.create(newUser);
        } catch (error) {
            console.log("User creation service error ::", error);
            throw new Error("User creation service error ::"+ error.message, error);
        }
    }
}

module.exports = new UserService();