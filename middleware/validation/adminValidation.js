const joi = require('joi');
const mongoose = require('mongoose');

class AdminValidation {

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
    create_employe = joi.object({
        name: joi.string()
            .required()
            .max(20)
            .min(4),

        work_group: joi.string()
            .required()
            .pattern(/^\S+$/)
            .valid(...this.work_group)
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

    select_delete_employe = joi.object({
        employe_id: joi.string()
            .custom(this.IsValidId, 'employe_id validate')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            }),
    });

    edit_emoloye = joi.object({
        name: joi.string()
            .max(20)
            .min(4),

        work_group: joi.string()
            .pattern(/^\S+$/)
            .valid(...this.work_group)
            .messages({
                "string.pattern.base": "Please enter work group from following Group_A, Group_B, Group_C, Group_D or remove whitespace"
            }),

        position: joi.string()
            .valid(...this.position)
            .pattern(/^\S+$/)
            .messages({
                "string.pattern.base": "Please enter position which is Intern, Junior, Senior, Head or remove whitespace"
            }),

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

    delete_review = joi.object({
        review_id: joi.string()
            .custom(this.IsValidId, 'review_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            })
    });

    reply_review = joi.object({
        review_id: joi.string()
            .custom(this.IsValidId, 'review_id validation')
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

    edit_reply = joi.object({
        review_id: joi.string()
            .custom(this.IsValidId, 'review_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            }),

        reply: joi.string()
            .min(10)
            .max(200)
    });

    delete_user = joi.object({
        user_id: joi.string()
            .custom(this.IsValidId, 'review_id validation')
            .required()
            .messages({
                'any.invalid':'Enter an valid mongoose object id'
            }),
    });

}

module.exports = new AdminValidation();