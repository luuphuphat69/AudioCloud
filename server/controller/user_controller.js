const User = require('../model/user');
const jwt = require("jsonwebtoken");
var token = null;

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
            console.log(user.Email)
            res.json({ token }); // Send the JWT token as a response
        }catch(error){
            console.error(error);
            res.status(500).json({message: "Server error"});
        }
    },
    deleteUser: async(req, res) => {
        const UserId = req.body;
        const user = await User.findOne(UserId);

        try{
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const userRole = decodedToken.role;

            if(decodedToken){
                if(userRole == "Admin"){
                    if(user.Role == "Admin"){
                        return res.status(403).json({message: "You can not delete an admin"});
                    }
                    const deletedUser = await User.deleteOne(user);
                    if (!deletedUser) {
                      return res.status(404).json({ message: 'User not found.' });
                    }
                    res.status(200).json({ message: 'User deleted successfully.' });
                }else{
                    res.status(403).json({message: "You're not the admin"});
                }
            }else{
                res.status(500).json({message: "You haven't login yet!!"});
            }

        }catch(error){
            res.status(500).json({message: "You haven't login yet!!"});
            console.log(error);
        }
    },
    getUserInfo: async(req, res) =>{
        try{
            const user = await User.findOne(req.body);
            res.status(200).json(user);
        }catch (error){
            console.log(error);
        }
    },
    editUserInfo: async(req, res) =>{
        try{
            const displayName = req.body.Displayname;
            const email = req.body.Email;
            const userId = req.params.UserId;

            console.log(userId);

            const updatedUser = await User.findOneAndUpdate(
                {UserId: userId},
                {$set:{Email: email, Displayname: displayName}},
                {new: true}
            );
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found.' });
              }

        }catch(error){
            res.status(500).json({message: "Server error"});
            console.log(error);
        }
    }
}
module.exports = userController;