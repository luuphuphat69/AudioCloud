const Audio = require('../model/audio');
const User = require('../model/user');
const UserFav = require('../model/user_favourite');
const RemoveAudioFromFavoritesCommand = require('../usage/command/RemoveAudioFromFavouriteCommand');
const AddAudioToFavouriteCommand = require('../usage/command/AddAudioToFavouriteCommand');
const Invoker = require('../usage/command/Invoker');

const Fav_Controller = {
    addAuToFav: async (req, res) => {
        const userId = req.params.userId;
        const audioId = req.params.audioId;
        const audio = await Audio.findOne({ AudioId: audioId });
        
        const command = new AddAudioToFavouriteCommand(userId, audio);
        const invoker = new Invoker(command);
        
        invoker.run();
        return res.status(201).json({ message:"Added successfully" });
    },    
    getListFav: async (req, res) => {
        try {
            const userId = req.params.userId;
            const fav = await UserFav.findOne({ UserId: userId });
            if (fav && fav.ListAudio) {
                return res.status(201).json(fav.ListAudio);
            } else {
                return res.status(404).send('Fav not found or ListAudio is empty');
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }
    },
    removeFav: async (req, res) => {
        try {
            const audioId = req.params.AudioId;
            const userId = req.params.UserId;

            const command = new RemoveAudioFromFavoritesCommand(userId, audioId);
            const invoker = new Invoker(command);
            invoker.run();

            return res.status(201).json({ message: 'Removed successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
}
module.exports = Fav_Controller;