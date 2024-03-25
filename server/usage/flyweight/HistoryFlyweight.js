const History = require('../../model/history');

class HistoryFlyweight {
    
    constructor() {
        this.userHistoryCache = {};
    }

    async getUserHistory(userId) {
        if (!this.userHistoryCache[userId]) {
            let histories = await History.find({ UserId: userId });
            if (histories) {
                this.userHistoryCache[userId] = histories;
            }
        }
        console.log(this.userHistoryCache);
        return this.userHistoryCache[userId];
    }
}
module.exports = new HistoryFlyweight();