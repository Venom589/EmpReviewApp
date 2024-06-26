const main_service = require('./mainService');
const bcrypt = require('bcrypt');

class UserService extends main_service {
    constructor(){
        super();
    }
    AllUsers = async () => {
        try {
            let allUsers = await this.user.find().select("_id name email role reviewed");
            return allUsers;
        } catch (error) {
            throw new Error("All user service Error :: ",error);
        }
    }
    DeleteUser = async (data) => {
        try {
            let checkUser = await this.findById(data.user_id);
            if (checkUser == null) {
                throw new Error("User not found");
            }
            await this.review.deleteMany({ user: (String)(checkUser._id) });
            await this.user.findByIdAndDelete(checkUser._id);
        } catch (error) {
            throw new Error("Delete user service Error :: ",error);
        }
    }
    ChangeName = async(data)=>{
        try {
            let userData = await this.user.findOne({ Email: data.email });
            if (userData == null) {
                throw new Error("User not found :: ");
            }
            if (data.name) {
                userData.name = data.name;
                await this.user.findByIdAndUpdate(userData._id, { name: userData.name });
            }
        } catch (error) {
            throw new Error("Change name service error :: ", error);
        }
    }
    AddReview = async(data)=>{
        try {
            let checkUser = await this.user.findOne({ email: data.email });
            if (checkUser == null) {
                throw new Error("User not found :: ");
            }
            let checkEmploye = await this.employe.findById(data.employe_id);
            if (checkEmploye == null) {
                throw new Error("Employe not found :: ");
            }
            let checkReviews = await this.review.find({ employe_id: data.employe_id, user: (String)(checkUser._id) });
            if (checkReviews.length == 3) {
                throw new Error("you have already review 3 time you cannot review now.");
            }
            let reveiwData = {
                user: checkUser._id,
                employeId: checkEmploye._id,
                review: data.review,
            }
            if (checkReviews.length == 0) {
                checkUser.reviewed.push({
                    employe_id: checkEmploye._id
                });
                await this.user.findByIdAndUpdate(checkUser._id, checkUser);
            }
            await this.review.create(reveiwData);
        } catch (error) {
            throw new Error("Add review service error :: ", error);
        }
    }
    EditReview = async(data)=>{
        try {
            let checkUser = await this.user.findOne({ email: data.email });
            if (checkUser == null) {
                throw new Error("User not found :: ");
            }
            let checkReview = await this.review.findOne({ _id: data.review_id, user: (String)(checkUser._id) });
            if (checkReview == null) {
                throw new Error("Review not found :: ");
            }
            if (data.review) {
                checkReview.review = data.review;
                await this.review.findByIdAndUpdate(checkReview._id, checkReview);
            }
        } catch (error) {
            throw new Error("Edit review service error :: ", error);
        }
    }
    UserCreation = async(data) =>{
        try {
            let encPassword = await bcrypt.hash(data.password, 15);
            let newUser = {
                name: data.name,
                email: data.email,
                password: encPassword,
                role: data.role
            }
            await this.user.create(newUser);
        } catch (error) {
            throw new Error("User creation service error :: ");
        }
    }
}

module.exports = new UserService();