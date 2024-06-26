const joi = require('joi');
const mongoose = require('mongoose');

class CommonValidation {

    role = ["admin", "user"]

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

        review: joi.string()
            .min(10)
            .max(200)
            .required()
    });

    signup = joi.object({
        email: joi.string()
            .email()
            .max(35)
            .required(),

        name: joi.string()
            .required()
            .min(4)
            .max(20),

        role: joi.string()
            .valid(...this.role)
            .required()
            .messages({
                "string.pattern.base": "Please enter role admin or user"
            }),
        password: joi.string()
            .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-_+=|{}[\]:;'"<>,.?/])\S+$/)
            .min(8)
            .max(16)
            .required()
            .messages({
                "string.pattern.base": "Please enter a password that includes at least one uppercase letter, one lowercase letter and one special character without whitespace"
            })
    });

    login = joi.object({
        email: joi.string()
            .email()
            .max(35)
            .required(),

        password: joi.string()
            .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-_+=|{}[\]:;'"<>,.?/])\S+$/)
            .min(8)
            .max(16)
            .required()
            .messages({
                "string.pattern.base": "Please enter a password that includes at least one uppercase letter, one lowercase letter and one special character without whitespace"
            }),

        role: joi.string()
            .valid(...this.role)
            .required()
            .messages({
                "string.pattern.base": "Please enter role admin or user"
            }),
    })
}

module.exports = new CommonValidation();