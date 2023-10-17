const Audio = require('../model/audio');
const User = require('../model/user');
const UserFav = require('../model/user_favourite');

const Fav_Controller = {
    addAuToFav: async (req, res) => {
        const userId = req.params.userId;
        const audioId = req.params.audioId;
        const audio = await Audio.findOne({ AudioId: audioId });
        
        try {
            const favourite = await UserFav.findOne({ UserId: userId });
            if (favourite) {
                // Check if the audio already exists in the list
                const existingAudioIndex = favourite.ListAudio.findIndex(a => a.AudioId === audioId);
                
                if (existingAudioIndex !== -1) {
                    // If the audio exists, replace it
                    favourite.ListAudio[existingAudioIndex] = audio;
                } else {
                    // If the audio doesn't exist, add it to the list
                    favourite.ListAudio.push(audio);
                }
                
                await favourite.save();
            } else {
                const _favourite = new UserFav({
                    UserId: userId,
                    ListAudio: [audio] // Create a new list with the audio
                });
                await _favourite.save();
            }
            return res.status(201).json({ message: "added to favs !!" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },    
    getListFav: async (req, res) => {
        try{
            const userId = req.params.userId;
            const fav = await UserFav.findOne({UserId: userId});
            return res.status(201).json(fav.ListAudio);
        }catch(err){
            console.log(err);
        }
    },
    // Add user to audio list fav
    addUserToAuFav: async(req, res) => {

    }
}
module.exports = Fav_Controller;