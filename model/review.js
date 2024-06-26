const mongoose = require('mongoose');

const review_schema = new mongoose.Schema({
    user: {
        type: String,
        default:"anonymous",
        max: [20, "Please enter name of 4-20 letters."],
        min: [4, "Please enter name of 4-20 letters."]
    },
    employe_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        require: [true, "Please select an employe."],
    },
    review: {
        type: String,
        require: [true, "Please enter your review."],
        max: [200, "Please enter name of 10-200 letters."],
        min: [10, "Please enter name of 10-200 letters."]
    },
    reply: {
        type: String,
        max: [200, "Please enter name of 10-200 letters."],
        min: [10, "Please enter name of 10-200 letters."]
    }
},{timestamps:true});

const review = mongoose.model("reviews", review_schema);

module.exports = review; 