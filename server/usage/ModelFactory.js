const Audio = require("../model/audio");
const User = require("../model/user");

class ModelFactory{
    createModel(){}
}
// Concrete factory for creating Audio objects
class AudioFactory extends ModelFactory {
    createModel(data) {
        return new Audio(data);
    }
}

// Concrete factory for creating User objects
class UserFactory extends ModelFactory {
    createModel(data) {
        return new User(data);
    }
}
module.exports = { AudioFactory, UserFactory};