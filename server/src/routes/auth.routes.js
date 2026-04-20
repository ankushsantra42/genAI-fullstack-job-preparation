const express = require("express");
const authRouter = express.Router();


const {registerUser, loginUser, logoutUser, getCurrentUser} = require("../controller/auth.controller");
const authUserMiddleware = require("../middleware/auth.middleware");


authRouter.post("/register", registerUser)
authRouter.post("/login", loginUser)
authRouter.post("/logout", logoutUser)
authRouter.get("/current-user", authUserMiddleware, getCurrentUser)


module.exports = authRouter;    