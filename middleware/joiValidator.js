module.exports.isSchemaValid = (schema) =>{
    try {
        return (req, res, next) => {
            const is_valid = schema.validate(req.body,{abortEarly:false});
            if(!is_valid.error){
                next()
            }else{
                console.log(is_valid.error);
                const errMessage = is_valid.error.details.map(detail=>detail.message);
                return res.status(401).json({
                    message: errMessage
                });
            }
        }
    } catch (error) {
        console.log("Joi Validation error :: ", error);
        throw error;
    }
}