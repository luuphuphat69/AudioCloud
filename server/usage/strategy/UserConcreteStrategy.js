const User = require('../../model/user');
const UserStrategy = require('./UserStrategy');
const bcrypt = require('bcrypt');

class CreateAccount extends UserStrategy {
    async create(UserId, Account, Password, Email, Role) {

        const existingUser = await User.findOne({ $or: [{ Account }, { Email }] });
        // Check if Account or Password is null or empty
        if (!Account || !Password) {
            throw new Error('Account or Password cannot be empty');
        }

        // Generate a salt (a random value used for hashing)
        const saltRounds = 10; // Recommended number of salt rounds
        const hash = await bcrypt.hash(Password, saltRounds);

        if (existingUser) {
            throw new Error('Account or Email already exists');
        }

        const newUser = new User({
            UserId,
            Account,
            Displayname: Account,
            Password: hash,
            Role: 'User',
            Email,
        });

        await newUser.save();
    }
}

class CreateAccountWithRole extends UserStrategy {
    async create(UserId, Account, Password, Email, Role) {
        const existingUser = await User.findOne({ $or: [{ Account }, { Email }] });

        // Check if Account or Password is null or empty
        if (!Account || !Password) {
            return res.status(400).json({ message: 'Account or Password cannot be empty' });
        }

        // Generate a salt (a random value used for hashing)
        const saltRounds = 10; // Recommended number of salt rounds
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                console.error(err);
                return;
            }
            // Hash the password with the generated salt
            bcrypt.hash(Password, salt, async (err, hash) => {
                if (err) {
                    console.error(err);
                    return;
                }
                if (existingUser) {
                    // If an account with the same Account or Email exists, return an error
                    return res.status(401).json({ message: 'Account or Email already exists' });
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
                res.status(201).json({ message: 'Registration successful', Account, Password, Email });
            });
        });
    } catch(error) {
        res.status(500).json({ message: error });
    }
}

module.exports = {CreateAccount, CreateAccountWithRole}