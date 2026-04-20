const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:[true, "This username has already taken"]
    },
    email:{
        type:String,
        required:true,
        unique:[true, "This email has already taken"]
    },
    password:{
        type:String,
        required:true
    }
})

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;  