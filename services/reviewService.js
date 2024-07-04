const Employee = require('../model/employee');
const Review = require('../model/review');
const User = require('../model/user');
const { roles } = require('../constants/roles');

class ReviewService {

    async addReview(data) {
        try {
            const user = await User.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found :: ");
            }
            const employee = await Employee.findOne({ _id: data.employee_id });
            if (employee == null) {
                throw new Error("Employee not found :: ");
            }
            const reviews = await Review.find({ employee_id: data.employee_id, user: (String)(user._id) });
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
                await User.findByIdAndUpdate(user._id, { reviewed: updateUserReviewed });
            }
            const newReview = await Review.create(reviewData);
            return newReview;
        } catch (error) {
            console.log("Add review service error ::", error);
            throw new Error(`Add review service error ::${error.message}`, error);
        }
    }
    async editReview(data) {
        try {
            const user = await User.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found :: ");
            }
            const review = await Review.findOne({ _id: data.review_id, user: (String)(user._id) });
            if (review == null) {
                throw new Error("Review not found :: ");
            }
            if (data.review) {
                await Review.findByIdAndUpdate(review._id, { review: data.review });
            }
        } catch (error) {
            console.log("Edit review service error ::", error);
            throw new Error(`Edit review service error ::${error.message}`, error);
        }
    }
    async deleteReview(data) {
        try {
            const deleteReview = await Review.findOne({ _id: data.review_id });
            if (deleteReview == null) {
                throw new Error("Review not found :: ");
            }
            if (deleteReview.user == roles.ANONYMOUS) {
                await Review.findByIdAndDelete(deleteReview._id);
                return;
            } else {
                await Review.findByIdAndDelete(deleteReview._id);
                const review = await Review.find({ employee_id: deleteReview.employee_id, user: (String)(deleteReview.user) });
                if (review.length == 0) {
                    const user = await User.findById(deleteReview.user);
                    const removeReview = user.reviewed.filter((x) => x.employee_id == deleteReview.employee_id);
                    await User.findByIdAndUpdate(deleteReview.user, { reviewed: removeReview });
                }
            }
        } catch (error) {
            console.log("Delete review service error ::", error);
            throw new Error(`Delete review service error ::${error.message}`, error);
        }
    }
    async replyReview(data) {
        try {
            const user = await User.findOne({ email: data.email });
            if (user == null) {
                throw new Error("User not found");
            }
            if (user.role != roles.ADMIN) {
                throw new Error("Admin not found");
            }
            const review = await Review.findById(data.review_id);
            if (review == null) {
                throw new Error("Review not found :: ");
            }
            if (review.reply != null) {
                throw new Error("You already replied this review");
            }
            await Review.findOneAndUpdate(
                { _id: review._id }, { reply: data.reply }),
                { timestamps: false };
        } catch (error) {
            console.log("Reply review service error ::", error);
            throw new Error(`Reply review service error ::${error.message}`, error);
        }
    }
    async editReply(data) {
        try {
            const review = await Review.findOne({ _id: data.review_id });
            if (review == null) {
                throw new Error("Review not found :: ");
            }
            if (review.reply == null) {
                throw new Error("You have not replied this review");
            }
            if (data.reply) {
                await Review.findOneAndUpdate({ _id: review._id }, { reply: data.reply }),
                    { timestamps: false };
            }
        } catch (error) {
            console.log("Edit reply service error ::", error);
            throw new Error(`Edit reply service error ::${error.message}`, error);
        }
    }
    async addAnonymousReview(data) {
        try {
            const employee = await Employee.findById(data.employee_id);
            if (employee == null) {
                throw new Error("Employee not found :: ");
            }
            const reviewData = {
                user: roles.ANONYMOUS,
                employee_id: employee._id,
                review: data.review,
            }
            await Review.create(reviewData);
        } catch (error) {
            console.log("Add anonymous review service error ::", error);
            throw new Error(`Add anonymous review service error ::${error.message}`, error);
        }
    }
}

module.exports = new ReviewService();