const joi = require('joi');
const mongoose = require('mongoose');

class AdminValidation {

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
    createEmployee = joi.object({
        name: joi.string()
            .required()
            .max(20)
            .min(4),

        work_group: joi.string()
            .required()
            .pattern(/^\S+$/)
            .valid(...this.workGroup)
            .messages({
                "string.pattern.base": "Please enter work group from following Group_A, Group_B, Group_C, Group_D or remove whitespace"
            }),

        position: joi.string()
            .required()
            .valid(...this.position)
            .pattern(/^\S+$/)
            .messages({
                "string.pattern.base": "Please enter position which is Intern, Junior, Senior, Head or remove whitespace"
            })
    });

    selectDeleteEmployee = joi.object({
        employee_id: joi.string()
            .custom(this.isValidId, 'employee_id validate')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            }),
    });

    editEmoloyee = joi.object({
        name: joi.string()
            .max(20)
            .min(4),

        work_group: joi.string()
            .pattern(/^\S+$/)
            .valid(...this.workGroup)
            .messages({
                "string.pattern.base": "Please enter work group from following Group_A, Group_B, Group_C, Group_D or remove whitespace"
            }),

        position: joi.string()
            .valid(...this.position)
            .pattern(/^\S+$/)
            .messages({
                "string.pattern.base": "Please enter position which is Intern, Junior, Senior, Head or remove whitespace"
            }),

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

    deleteReview = joi.object({
        review_id: joi.string()
            .custom(this.isValidId, 'review_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            })
    });

    replyReview = joi.object({
        review_id: joi.string()
            .custom(this.isValidId, 'review_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            }),

        email: joi.string()
            .email()
            .required(),

        reply: joi.string()
            .min(10)
            .max(200)
            .required()
    });

    editReply = joi.object({
        review_id: joi.string()
            .custom(this.isValidId, 'review_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            }),

        reply: joi.string()
            .min(10)
            .max(200)
    });

    deleteUser = joi.object({
        user_id: joi.string()
            .custom(this.isValidId, 'review_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            }),
    });

}

module.exports = new AdminValidation();