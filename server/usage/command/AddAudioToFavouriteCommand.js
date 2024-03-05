const UserFav = require('../../model/user_favourite');
const Command = require('../command/Command');

class AddAudioToFavouriteCommand extends Command {
    constructor(userId, audio) {
        super();
        this.userId = userId;
        this.audio = audio;
    }

    async execute() {
        try {
            const favourite = await UserFav.findOne({ UserId: this.userId });
            if (favourite) {
                const existingAudioIndex =  favourite.ListAudio.findIndex(a => a.AudioId === this.audio.AudioId);
                if (existingAudioIndex !== -1) {
                    favourite.ListAudio[existingAudioIndex] = this.audio;
                } else {
                    favourite.ListAudio.push(this.audio);
                }
                await favourite.save();
            } else {
                const _favourite = new UserFav({
                    UserId: this.userId,
                    ListAudio: [this.audio]
                });
                await _favourite.save();
            }
            return "Added to favorites";
        } catch (err) {
            throw err;
        }
    }
}
module.exports = AddAudioToFavouriteCommand;