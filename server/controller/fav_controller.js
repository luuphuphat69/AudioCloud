const { model } = require('mongoose');
const Audio = require('../model/audio');
const User = require('../model/user');
const UserFav = require('../model/user_favourite');

const Fav_Controller = {
    // Add audio to user favs
    addAuToFav: async (req, res) => {
        const userId = req.params.userId;
        const audioId = req.params.audioId;
        console.log(userId);
        console.log(audioId);
        try{
            const favourite = await UserFav.find({UserId: userId});
            if(favourite){
                favourite.ListAudio.push(audioId);
                await favourite.save();
            }else{
                favourite = new UserFav({
                    UserId: userId
                });
                favourite.ListAudio.push(audioId);
            }
            return res.status(201).json({message: "added to favs !!"});
        }catch(err){
            console.log(err);
        }
    },
    // Add user to audio list fav
    addUserToAuFav: async(req, res) => {

    }
}
module.exports = Fav_Controller;