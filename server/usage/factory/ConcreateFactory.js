const Audio = require("../../model/audio");
const User = require("../../model/user");
const ModelFactory = require("../factory/ModelFactory");

class ConcreateFactory extends ModelFactory{
    createModel(modelName, data){
        switch(modelName){
            case 'Audio':
                return new Audio(data);
                break;
            case 'User':
                return new User(data);
                break;
            default:
                return;
        }
    }
}
module.exports = ConcreateFactory;