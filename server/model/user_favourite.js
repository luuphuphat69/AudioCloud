const mongoose = require('mongoose');

const UserFavouriteSchema = new mongoose.Schema({
    UserId:{
        type:String,
        require: true,
    },
    ListAudio:{
        type:Array,
        require: false,
    }
});
const UserFav = mongoose.model("User_Favourite", UserFavouriteSchema, "User_Favourite");
module.exports = UserFav;