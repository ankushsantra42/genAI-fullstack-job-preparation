const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../model/blacklist.model");



async function registerUser(req, res){
    try {
        const {userName, email, password} = req.body;

        if(!userName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const isUserExist = await userModel.findOne({
            $or: [
                { userName },
                { email }
            ]
        });

        if(isUserExist){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({userName, email, password: hashedPassword});

            const token = jwt.sign(
            {id: newUser._id,userName:newUser.userName,email:newUser.email},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({message: "User registered successfully", user:{
            id: newUser._id,
            userName: newUser.userName,
            email: newUser.email
        }});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

async function loginUser(req, res){
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid password"});
        }

        const token = jwt.sign(
            {id: user._id,userName:user.userName,email:user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({message: "User logged in successfully", user:{
            id: user._id,
            userName: user.userName,
            email: user.email
        }});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}


async function logoutUser(req, res){
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message: "No token found"});
        }
        const blackListToken = await blackListTokenModel.create({token});
        res.clearCookie("token");
        return res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}


module.exports = {registerUser, loginUser, logoutUser} 