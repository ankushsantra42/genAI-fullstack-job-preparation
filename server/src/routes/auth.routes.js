const express = require("express");
const authRouter = express.Router();


const {registerUser, loginUser, logoutUser} = require("../controller/auth.controller");


authRouter.post("/register", registerUser)
authRouter.post("/login", loginUser)
authRouter.post("/logout", logoutUser)



module.exports = authRouter;    