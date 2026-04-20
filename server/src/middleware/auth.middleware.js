const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../model/blacklist.model");


async function authUserMiddleware(req, res, next){
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message: "No token found"});
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const isTokenBlacklisted = await blackListTokenModel.findOne({token});
        if(isTokenBlacklisted){
            return res.status(400).json({message: "Token is blacklisted"});
        }
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

module.exports = authUserMiddleware;