const joi = require('joi');
const mongoose = require('mongoose');

class UserValidation {

    workGroup = ["Group_A", "Group_B", "Group_C", "Group_D"];

    position = ["Intern", "Junior", "Senior", "Head"];

    isValidId = (value, helpers) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error;
            }
            return value;    
        } catch (error) {
            return helpers.error('any.invalid');
        }
    }

    selectEmployee = joi.object({
        employee_id: joi.string()
            .custom(this.isValidId, 'employee_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            })
    });

    addReview = joi.object({
        employee_id: joi.string()
            .custom(this.isValidId, 'employee_id validation')
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

    editName = joi.object({
        name: joi.string()
            .min(4)
            .max(20),

        email: joi.string()
            .email()
            .required()
            .max(35)
    });

    editReview = joi.object({
        review_id: joi.string()
            .custom(this.isValidId, 'review_id validation')
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