const joi = require('joi');
const mongoose = require('mongoose');

class AdminValidation {

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
            .custom(this.IsValidId, 'employe_id')
            .required()
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

    delete_review = joi.object({
        review_id: joi.string()
            .custom(this.IsValidId, 'review_id')
            .required()
    });

    reply_review = joi.object({
        review_id: joi.string()
            .custom(this.IsValidId, 'review_id')
            .required(),

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
            .custom(this.IsValidId, 'review_id')
            .required(),

        reply: joi.string()
            .min(10)
            .max(200)
    });

    delete_user = joi.object({
        user_id: joi.string()
            .custom(this.IsValidId, 'review_id')
            .required(),
    });

}

module.exports = new AdminValidation();