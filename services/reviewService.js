const main_service = require('./mainService');

class ReviewService extends main_service {
    constructor() {
        super();
    }
    addReview = async (data) => {
        try {
            const user = await this.user.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found :: ");
            }
            const employee = await this.employee.findOne({ _id: data.employee_id });
            if (employee == null) {
                throw new Error("Employee not found :: ");
            }
            const reviews = await this.review.find({ employee_id: data.employee_id, user: (String)(user._id) });
            if (reviews.length == 3) {
                throw new Error("you have already review 3 time you cannot review now.");
            }
            const reviewData = {
                user: user._id,
                employee_id: employee._id,
                review: data.review,
            }
            if (reviews.length == 0) {
                let updateUserReviewed = user.reviewed;
                updateUserReviewed.push({
                    employee_id: employee._id
                });
                await this.user.findByIdAndUpdate(user._id, { reviewed: updateUserReviewed });
            }
            const newReview = await this.review.create(reviewData);
            return newReview;
        } catch (error) {
            console.log("Add review service error ::",error);
            throw new Error("Add review service error ::" + error.message, error);
        }
    }
    editReview = async (data) => {
        try {
            const user = await this.user.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found :: ");
            }
            const review = await this.review.findOne({ _id: data.review_id, user: (String)(user._id) });
            if (review == null) {
                throw new Error("Review not found :: ");
            }
            if (data.review) {
                await this.review.findByIdAndUpdate(review._id, { review: data.review });
            }
        } catch (error) {
            console.log("Edit review service error ::",error);
            throw new Error("Edit review service error ::" + error.message, error);
        }
    }
    deleteReview = async (data) => {
        try {
            const deleteReview = await this.review.findOne({ _id: data.review_id });
            if (deleteReview == null) {
                throw new Error("Review not found :: ");
            }
            if (deleteReview.user != "anonymous") {
                await this.review.findByIdAndDelete(deleteReview._id);
                const review = await this.review.find({ employee_id: deleteReview.employee_id, user: (String)(deleteReview.user) });
                if (review.length == 0 ) {
                    const user = await this.user.findById(deleteReview.user);
                    const removeReview =user.reviewed.filter((x) => x.employee_id == deleteReview.employee_id); 
                    await this.user.findByIdAndUpdate(deleteReview.user, { reviewed: removeReview });
                }
            } else {
                await this.review.findByIdAndDelete(deleteReview._id);
            }
        } catch (error) {
            console.log("Delete review service error ::", error);
            throw new Error("Delete review service error ::" + error.message, error);
        }
    }
    replyReview = async (data) => {
        try {
            const user = await this.user.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found");
            }
            if (user.role != "admin") {
                throw new Error("Admin not found");
            }
            const review = await this.review.findById(data.review_id);
            if (review == null) {
                throw new Error("Review not found :: ");
            }
            if (review.reply != null) {
                throw new Error("You already replied this review");
            }
            await this.review.findOneAndUpdate(
                { _id: review._id }, { reply: data.reply }),
                { timestamps: false };
        } catch (error) {
            console.log("Reply review service error ::", error);
            throw new Error("Reply review service error ::" + error.message, error);
        }
    }
    editReply = async (data) => {
        try {
            const review = await this.review.findOne({ _id: data.review_id });
            if (review == null) {
                throw new Error("Review not found :: ");
            }
            if (review.reply == null) {
                throw new Error("You have not replied this review");
            }
            if (data.reply) {
                await this.review.findOneAndUpdate({ _id: review._id }, { reply: data.reply }),
                { timestamps: false };
            }
            
        } catch (error) {
            console.log("Edit reply service error ::", error);
            throw new Error("Edit reply service error ::" + error.message, error);
        }
    }
    addAnonymousReview = async (data) => {
        try {
            const employee = await this.employee.findById(data.employee_id);
            if (employee == null) {
                throw new Error("Employee not found :: ");
            }
            const reveiwData = {
                user: "anonymous",
                employee_id: employee._id,
                review: data.review,
            }
            await this.review.create(reveiwData);
        } catch (error) {
            console.log("Add anonymous review service error ::", error);
            throw new Error("Add anonymous review service error ::" + error.message, error);
        }
    }
}

module.exports = new ReviewService();