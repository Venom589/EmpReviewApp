const joi = require('joi');
const mongoose = require('mongoose');

class UserValidation {

    work_group = ["Group_A", "Group_B", "Group_C", "Group_D"];

    position = ["Intern", "Junior", "Senior", "Head"];

    IsValidId = (value, helpers) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error;
            }
            return value;    
        } catch (error) {
            return helpers.error('any.invalid');
        }
    }

    select_employe = joi.object({
        employe_id: joi.string()
            .custom(this.IsValidId, 'employe_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            })
    });

    add_review = joi.object({
        employe_id: joi.string()
            .custom(this.IsValidId, 'employe_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            }),

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
            .custom(this.IsValidId, 'review_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            }),

        email: joi.string()
            .email()
            .required(),

        review: joi.string()
            .min(10)
            .max(200)
    });
}

module.exports = new UserValidation();