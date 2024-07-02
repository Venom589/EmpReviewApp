const joi = require('joi');
const mongoose = require('mongoose');

class CommonValidation {

    role = ["admin", "user"]

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