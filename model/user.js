const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter Name."],
        max: [20, "Please enter name of 4-20 letters."],
        min: [4, "Please enter name of 4-20 letters."]
    },
    email: {
        type: String,
        require: [true, "Please enter Email"],
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "please enter valid email"],
        max: [35, "Please enter email within 35 letters."],
        unique: true
    },
    password: {
        type: String,
        require: [true, "Please enter Password."],
    },
    reviewed: [
        {
            employee_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "employees"
            }
        }
    ],
    role: {
        type: String,
        enum: ["admin", "user"],
    }
});

const user = mongoose.model("users", user_schema);

module.exports = user; 