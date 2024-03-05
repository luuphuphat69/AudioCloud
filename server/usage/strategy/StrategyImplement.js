class StrategyImplement{
    constructor(UserStrategy){
        this.UserStrategy = UserStrategy
    }
    setStrategy(UserStrategy){
        this.UserStrategy = UserStrategy;
    }
    createAccount(UserId, Account, Password, Email, Role){
        this.UserStrategy.create(UserId, Account, Password, Email, Role);
    }
}
module.exports = StrategyImplement;