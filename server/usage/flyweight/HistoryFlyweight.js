const History = require('../../model/history');

class HistoryFlyweight {
    
    constructor() {
        this.userHistoryCache = {};
    }

    async getUserHistory(userId) {
        if (!this.userHistoryCache[userId]) {
            let history = await History.findOne({ UserId: userId });
            if (history) {
                this.userHistoryCache[userId] = history;
            }
        }
        console.log(this.userHistoryCache);
        return this.userHistoryCache[userId];
    }
}
module.exports = new HistoryFlyweight();