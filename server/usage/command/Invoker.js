class Invoker{
    constructor(Command){
        this.Command = Command;
    }
    run(){
        this.Command.execute();
    }
}
module.exports = Invoker;