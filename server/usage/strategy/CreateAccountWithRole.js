const User = require('../../model/user');
const UserStrategy = require('./UserStrategy');
const bcrypt = require('bcrypt');

class CreateAccountWithRole extends UserStrategy {
    async create(UserId, Account, Password, Email, Role) {
        try {
            const existingUser = await User.findOne({ $or: [{ Account }, { Email }] });
            
            if (!Account || !Password) {
                throw new Error('Account or Password cannot be empty');
            }
    
            const saltRounds = 10;
            const hash = await bcrypt.hash(Password, saltRounds);
    
            if (existingUser) {
                throw new Error('Account or Email already exists');
            }
    
            const newUser = new User({
                UserId,
                Account,
                Displayname: Account,
                Password: hash,
                Role: Role,
                Email,
            });
    
            await newUser.save();
            return { message: 'Registration successful', Account, Password, Email };
        } catch (error) {
            throw error;
        }
    }
}
module.exports = CreateAccountWithRole;