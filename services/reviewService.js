const main_service = require('./mainService');

    class ReviewService extends main_service{
    constructor(){
        super();
    }
    AddReview = async (data) => {
        try {
            let checkUser = await this.user.findOne({ email: data.email });
            if (checkUser == null) {
                throw new Error("User not found :: ");
            }
            let checkEmploye = await this.employe.findOne({_id:data.employe_id});
            if (checkEmploye == null) {
                throw new Error("Employe not found :: ");
            }
            let checkReviews = await this.review.find({ employe_id: data.employe_id, user: (String)(checkUser._id) });
            if (checkReviews.length == 3) {
                throw new Error("you have already review 3 time you cannot review now.");
            }
            let reveiwData = {
                user: checkUser._id,
                employe_id: checkEmploye._id,
                review: data.review,
            }
            if (checkReviews.length == 0) {
                checkUser.reviewed.push({
                    employe_id: checkEmploye._id
                });
                await this.user.findByIdAndUpdate(checkUser._id, checkUser);
            }
            let newReview = await this.review.create(reveiwData);
            return newReview;
        } catch (error) {
            throw new Error("Add review service error ::"+error.message, error);
        }
    }
    EditReview = async (data) => {
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
            throw new Error("Edit review service error ::"+error.message, error);
        }
    }
    DeleteReview = async (data) => {
        try {
            let deleteReview = await this.review.findOne({ _id: data.review_id });
            if (deleteReview == null) {
                throw new Error("Review not found :: ");
            }
            await this.review.findByIdAndDelete(deleteReview._id);
            if (deleteReview.user != "anonymous") {
                let checkReviews = await this.review.find({ employe_id: deleteReview.employe_id, user: (String)(deleteReview.user) });
                if (checkReviews.length == 0 || checkReviews == null) {
                    let user = await this.user.findById(deleteReview.user);
                    user.reviewed = user.reviewed.filter((x) => x.employe_id != deleteReview.employe_id);
                    await this.user.findByIdAndUpdate(user._id, { reviewed: user.reviewed });
                }
            }else{
                await this.review.findByIdAndDelete(deleteReview._id);
            }
        } catch (error) {
            throw new Error("Delete review service error ::"+error.message, error);
        }
    }
    ReplyReview = async (data) => {
        try {
            let checkUser = await this.user.findOne({ email: data.email });
            if (checkUser.role != "admin" || checkUser == null) {
                throw new Error("Admin not found");
            }
            let checkReviews = await this.review.findById(data.review_id);
            if (checkReviews == null) {
                throw new Error("Review not found :: ");
            }
            if (checkReviews.reply != null) {
                throw new Error("You already replied this review");
            }
            await this.review.findOneAndUpdate(
                { _id: checkReviews._id }, { reply: data.reply }),
                { timestamps: false };
        } catch (error) {
            throw new Error("Reply review service error ::"+error.message, error);
        }
    }
    EditReply = async (data) => {
        try {
            let checkReviews = await this.review.findOne({ _id: data.review_id });
            if (checkReviews == null) {
                throw new Error("Review not found :: ");
            }
            if (checkReviews.reply == null) {
                throw new Error("You have not replied this review");
            }
            if (data.reply) {
                checkReviews.reply = data.reply;
            }
            await this.review.findOneAndUpdate({ _id: checkReviews._id }, { reply: checkReviews.reply }),
                { timestamps: false };
        } catch (error) {
            throw new Error("Edit reply service error ::"+error.message, error);
        }
    }
    AddAnonymousReview = async(data) =>{
        try {
            let checkEmploye = await this.employe.findById(data.employe_id);
            if (checkEmploye == null) {
                throw new Error("Employe not found :: ");
            }
            let reveiwData = {
                user: "anonymous",
                employe_id: checkEmploye._id,
                review: data.review,
            }
            await this.review.create(reveiwData);
        } catch (error) {
            throw new Error("Add anonymous reviw service error ::"+error.message, error);
        }
    }
}

module.exports = new ReviewService();