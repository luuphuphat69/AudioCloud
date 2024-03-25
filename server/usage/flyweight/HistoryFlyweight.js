const History = require('../../model/history');

class HistoryFlyweight {
    
    constructor() {
        this.userHistoryCache = {};
    }

    async getUserHistory(userId) {
        if (!this.userHistoryCache[userId]) {
            let histories = await History.find({ UserId: userId });
            if (histories && histories.length > 0) {
                this.userHistoryCache[userId] = histories;
            } else {
                this.userHistoryCache[userId] = []; // Initialize empty array if no history found
            }
        }
        console.log(this.userHistoryCache);
        return this.userHistoryCache[userId];
    }
}
module.exports = new HistoryFlyweight();