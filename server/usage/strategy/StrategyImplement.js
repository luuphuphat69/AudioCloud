class StrategyImplement {
    constructor(UserStrategy) {
        this.UserStrategy = UserStrategy;
    }
    
    setStrategy(UserStrategy) {
        this.UserStrategy = UserStrategy;
    }
    
    async createAccount(UserId, Account, Password, Email, Role) {
        try {
            const newUser = await this.UserStrategy.create(UserId, Account, Password, Email, Role);
            return newUser; // Return the new user created
        } catch (error) {
            throw error;
        }
    }
}

module.exports = StrategyImplement;
