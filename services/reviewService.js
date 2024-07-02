const MainService = require('./mainService');

class ReviewService extends MainService {
    constructor() {
        super();
    }
    async addReview(data){
        try {
            const user = await this.User.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found :: ");
            }
            const employee = await this.Employee.findOne({ _id: data.employee_id });
            if (employee == null) {
                throw new Error("Employee not found :: ");
            }
            const reviews = await this.Review.find({ employee_id: data.employee_id, user: (String)(user._id) });
            if (reviews.length == 3) {
                throw new Error("you have already review 3 time you cannot review now.");
            }
            const reviewData = {
                user: user._id,
                employee_id: employee._id,
                review: data.review,
            }
            if (reviews.length == 0) {
                const updateUserReviewed = user.reviewed;
                updateUserReviewed.push({
                    employee_id: employee._id
                });
                await this.User.findByIdAndUpdate(user._id, { reviewed: updateUserReviewed });
            }
            const newReview = await this.Review.create(reviewData);
            return newReview;
        } catch (error) {
            console.log("Add review service error ::",error);
            throw new Error(`Add review service error ::${error.message}`, error);
        }
    }
    async editReview(data){
        try {
            const user = await this.User.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found :: ");
            }
            const review = await this.Review.findOne({ _id: data.review_id, user: (String)(user._id) });
            if (review == null) {
                throw new Error("Review not found :: ");
            }
            if (data.review) {
                await this.Review.findByIdAndUpdate(review._id, { review: data.review });
            }
        } catch (error) {
            console.log("Edit review service error ::",error);
            throw new Error(`Edit review service error ::${error.message}`, error);
        }
    }
    async deleteReview(data){
        try {
            const deleteReview = await this.Review.findOne({ _id: data.review_id });
            if (deleteReview == null) {
                throw new Error("Review not found :: ");
            }
            if (deleteReview.user == this.roles.ANONYMOUS) {
                await this.Review.findByIdAndDelete(deleteReview._id);
                return;
            } else {
                await this.Review.findByIdAndDelete(deleteReview._id);
                const review = await this.Review.find({ employee_id: deleteReview.employee_id, user: (String)(deleteReview.user) });
                if (review.length == 0 ) {
                    const user = await this.User.findById(deleteReview.user);
                    const removeReview =user.reviewed.filter((x) => x.employee_id == deleteReview.employee_id); 
                    await this.User.findByIdAndUpdate(deleteReview.user, { reviewed: removeReview });
                }
            }
        } catch (error) {
            console.log("Delete review service error ::", error);
            throw new Error(`Delete review service error ::${error.message}`, error);
        }
    }
    async replyReview(data){
        try {
            const user = await this.User.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found");
            }
            if (user.role != this.roles.ADMIN) {
                throw new Error("Admin not found");
            }
            const review = await this.Review.findById(data.review_id);
            if (review == null) {
                throw new Error("Review not found :: ");
            }
            if (review.reply != null) {
                throw new Error("You already replied this review");
            }
            await this.Review.findOneAndUpdate(
                { _id: review._id }, { reply: data.reply }),
                { timestamps: false };
        } catch (error) {
            console.log("Reply review service error ::", error);
            throw new Error(`Reply review service error ::${error.message}`, error);
        }
    }
    async editReply(data){
        try {
            const review = await this.Review.findOne({ _id: data.review_id });
            if (review == null) {
                throw new Error("Review not found :: ");
            }
            if (review.reply == null) {
                throw new Error("You have not replied this review");
            }
            if (data.reply) {
                await this.Review.findOneAndUpdate({ _id: review._id }, { reply: data.reply }),
                { timestamps: false };
            }
            
        } catch (error) {
            console.log("Edit reply service error ::", error);
            throw new Error(`Edit reply service error ::${error.message}`, error);
        }
    }
    async addAnonymousReview(data){
        try {
            const employee = await this.Employee.findById(data.employee_id);
            if (employee == null) {
                throw new Error("Employee not found :: ");
            }
            const reviewData = {
                user: this.roles.ANONYMOUS,
                employee_id: employee._id,
                review: data.review,
            }
            await this.Review.create(reviewData);
        } catch (error) {
            console.log("Add anonymous review service error ::", error);
            throw new Error(`Add anonymous review service error ::${error.message}`, error);
        }
    }
}

module.exports = new ReviewService();