const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        UserId:{
            type: String, require: true
        },
        Account:{
            type: String, require: true
        },
        Password:{
            type: String, require: true
        },
        Displayname:{
            type:String, require: true
        },
        Bio:{
            type:String, require: false
        },
        DOB:{
            type:String, require:true
        },
        Email:{
            type:String, require: true
        },
        Sex:{
            type:String, require: true
        },
        Role:{
            type: String, require: true
        },
        Address:{
            type: String, require: false
        },
        ProfilePic:{
            type:String, require: false
        },
        isPro:{
            type: Boolean, require: true
        },
        isArtist:{
            type: Boolean, require: false
        }
    }
);
const User = mongoose.model("User", userSchema, "User");
module.exports = User;