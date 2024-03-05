const UserFav = require('../../model/user_favourite');
const Command = require('../command/Command');

class RemoveAudioFromFavouriteCommand extends Command {
    constructor(userId, audioId) {
        super();
        this.userId = userId;
        this.audioId = audioId;
    }
    async execute() {
        try {
            const fav = await UserFav.findOne({ UserId: this.userId });
            if (!fav) {
                return "UserFav document not found";
            }
            fav.ListAudio = fav.ListAudio.filter((audio) => audio.AudioId !== this.audioId);
            await fav.save();
            return "Removed from favorites";
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = RemoveAudioFromFavouriteCommand;