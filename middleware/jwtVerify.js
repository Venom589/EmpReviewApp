const jwt = require('jsonwebtoken');

module.exports.adminJwtVerify = async (req, res, next) => {
    try {
        if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer"){
            jwt.verify(req.headers.authorization.split(" ")[1],
                process.env.ADMIN_JWT_SECRET,(err, decoded)=>{
                    if(err){throw new Error("jwt not verified :: ")}
                });
            next();
        }else{
            throw new Error("Jwt not found");
        }
    } catch (error) {
        console.log("jwt Error :: ",error);
        res.sendStatus(401);
    }
}

module.exports.userJwtVerify = async (req, res, next) => {
    try {
        if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer"){
            jwt.verify(req.headers.authorization.split(" ")[1],
                process.env.USER_JWT_SECRET,(err, decoded)=>{
                    if(err){throw new Error("jwt not verified :: ")}
                });
            next();
        }else{
            throw new Error("Jwt not found");
        }
    } catch (error) {
        console.log("jwt Error :: ",error);
        res.sendStatus(401);
    }
}