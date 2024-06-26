const joi = require('joi');
const mongoose = require('mongoose');

class UserValidation {

    work_group = ["Group_A", "Group_B", "Group_C", "Group_D"];

    position = ["Intern", "Junior", "Senior", "Head"];

    IsValidId = async (id) => {
        try {
            if (!mongoose.isValidObjectId(id)) {
                throw new Error("Id not valid");
            }
        } catch (error) {
            throw error;
        }
    }

    select_employe = joi.object({
        employe_id: joi.string()
            .custom(this.IsValidId, 'employe_id')
            .required()
    });

    add_review = joi.object({
        employe_id: joi.string()
            .custom(this.IsValidId, 'employe_id')
            .required(),

        email: joi.string()
            .email()
            .required(),

        review: joi.string()
            .min(10)
            .max(200)
            .required()
    });

    edit_name = joi.object({
        name: joi.string()
            .min(4)
            .max(20),

        email: joi.string()
            .email()
            .required()
            .max(35)
    });

    edit_review = joi.object({
        review_id: joi.string()
            .custom(this.IsValidId, 'review_id')
            .required(),

        email: joi.string()
            .email()
            .required(),

        review: joi.string()
            .min(10)
            .max(200)
    });
}

module.exports = new UserValidation();