const History = require("../model/history");

const HistoryController = {

    updateHistory: async (req, res) => {
        try {
            const userId = req.params.userId;
            const audioId = req.params.audioId;
            const audio = await Audio.findOne({ AudioId: audioId });

            let history = await History.findOne({ UserId: userId });

            if (!history) {
                history = new History({ UserId: userId, ListAudio: [] });
            }

            const existingAudioIndex = history.ListAudio.findIndex((a) => a.AudioId === audioId);

            if (existingAudioIndex !== -1) {
                history.ListAudio[existingAudioIndex] = audio;
            } else {
                history.ListAudio.push(audio);
            }
            await history.save();
            return res.status(200);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },
    getHistory: async (req, res) => {
        const userId = req.params.userId;
        const history = await History.findOne({UserId: userId});
        if(history){
            return res.status(200).json(history);
        }else{
            return res.status(500).json({message:"Server error"});
        }
    }
}
module.exports = HistoryController;