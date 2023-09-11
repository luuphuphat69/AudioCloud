const User = require('../model/user');
const jwt = require("jsonwebtoken");
const token = 'token';

const userController = {
    getAllUser: async (req, res) => {
        try{
            const users = await User.find();
            res.json(users)
        }catch(error){
            console.log(error);
            res.status(500).json({message: "Server error"});
        }
    },
    login: async (req, res) => {
        try{
            const { Account, Password } = req.body;
            const user = await User.findOne({Account});
            if(!user || user.Password !== Password){
                return res.status(401).json({message: "Invalid username or password"});
            }
            token = jwt.sign({ userId: user.UserId, role: user.Role }, process.env.SECRET_KEY, {
                expiresIn: '1h',
            });
            console.log(customer.Email)
            res.json({ token }); // Send the JWT token as a response
        }catch(error){
            console.error(error);
            res.status(500).json({message: "Server error"});
        }
    }
}
module.exports = userController;