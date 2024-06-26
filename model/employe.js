const mongoose = require('mongoose');

const employe_schema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter name."],
        max: [20, "Please enter name of 4-20 letters."],
        min: [4, "Please enter name of 4-20 letters."]
    },
    work_group: {
        type: String,
        require: [true, "Please enter a work group"],
        enum:["Group_A", "Group_B", "Group_C", "Group_D"],
    },
    position: {
        type: String,
        require: [true, "Please enter position."],
        enum:["Intern", "Junior", "Senior", "Head"]
    }
});

const employe = mongoose.model("employees", employe_schema);

module.exports = employe; 