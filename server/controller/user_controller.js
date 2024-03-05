const User = require('../model/user');
const Audio = require('../model/audio');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const admin = require("firebase-admin");
const StrategyImplement = require("../usage/strategy/StrategyImplement");
const CreateAccount = require("../usage/strategy/UserConcreteStrategy");
const CreateAccountWithRole = require("../usage/strategy/UserConcreteStrategy");

const storage = admin.storage();
const storageBucket = storage.bucket();

const strategyImplement = new StrategyImplement();

const userController = {
    getAllUser: async (req, res) => {
        try {
            const users = await User.find();
            res.json(users)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error" });
        }
    },
    login: async (req, res) => {
        try {
            const { Account, Password } = req.body;
            const user = await User.findOne({ Account });
            if (!user) {
                return res.status(401).json({ message: "Invalid username" });
            }
            bcrypt.compare(Password, user.Password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: "Invalid password" });
                }
                if (result) {
                    // Passwords match, authentication is successful
                    console.log('Authentication successful');
                    // Create JWT
                    const token = jwt.sign({ userId: user.UserId, role: user.Role, userDisplayname: user.Displayname, isPro: user.isPro }, process.env.SECRET_KEY, {
                        expiresIn: '1h',
                    });
                    // Save token into cookies
                    res.cookie('token', token, { secure: false, maxAge: (60 * 60 * 24 * 30) * 1000, path: '/', domain: ".54.161.251.210" });
                    return res.status(201).json(token);
                } else {
                    console.log('Authentication failed');
                    return res.status(401).json({ message: "Invalid password" });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },
    register: async (req, res) => {
        try {
            const { Account, Password, Email } = req.body
            const UserId = generateUserId();
            
            strategyImplement.setStrategy(new CreateAccount());
            strategyImplement.createAccount(UserId, Account, Password, Email, null);
            
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    createAccount: async (req, res) => {
        try {
            const { Account, Password, Email, Role} = req.body
            const UserId = generateUserId();
            
            strategyImplement.setStrategy(new CreateAccountWithRole());
            strategyImplement.createAccount(UserId, Account, Password, Email, Role);
            
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    logout: async (req, res) => {
        res.clearCookie('token');
        res.clearCookie('user');
    },
    deleteUser: async (req, res) => {

        const userId = req.params.userId;
        // Use the filter object in the findOne method
        const user = await User.findOne({ UserId: userId });
        
        try {
            if (user.Role == "Admin") {
                return res.status(403).json({ message: "You can not delete an admin" });
            }
            await User.deleteOne(user);
            await Audio.deleteMany({UserId: userId});
            res.status(200).json({ message: 'User deleted successfully.' });
        }
        catch (error) {
            res.status(500).json({ message: "You haven't login yet!!" });
            console.log(error);
        }
    },
    getUserInfo: async (req, res) => {
        try {
            const userId = req.params.UserId;
            const user = await User.findOne({ UserId: userId });
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
        }
    },
    editUserInfo: async (req, res) => {
        try {
            const { Displayname, Address, Bio } = req.body;
            const photoFile = req.files['UserPhoto'] ? req.files['UserPhoto'][0] : null;
            const userId = req.params.UserId;
            let PhotoUrl = null;
            const user = await User.findOne({ UserId: userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (photoFile) {
                PhotoUrl = await uploadUserPhoto(photoFile);
                user.ProfilePic = PhotoUrl;
            }
            if (Displayname !== undefined && Displayname !== null && Displayname.trim() !== "") {
                user.Displayname = Displayname;
            }
            if (Address !== undefined && Address !== null && Address.trim() !== "") {
                user.Address = Address;
            }
            if (Bio !== undefined && Bio !== null && Bio.trim() !== "") {
                user.Bio = Bio;
            }

            await user.save();
            return res.status(201).json({ message: "Change user info success" });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
            console.log(error);
        }
    },
    // Admin edit profile
    updateUserInfo: async (req, res) => {
        try {
          const { Displayname, Address, Bio, Role } = req.body;
          const userId = req.params.UserId;
          const photoFile = req.files['UserPhoto'] ? req.files['UserPhoto'][0] : null;
          let PhotoUrl = null;
      
          const user = await User.findOne({ UserId: userId });
      
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
      
          if (photoFile) {
            PhotoUrl = await uploadUserPhoto(photoFile);
            user.ProfilePic = PhotoUrl;
          }
      
          if (Displayname !== undefined && Displayname !== null && Displayname.trim() !== "") {
            user.Displayname = Displayname;
          }
          if (Address !== undefined && Address !== null && Address.trim() !== "") {
            user.Address = Address;
          }
          if (Bio !== undefined && Bio !== null && Bio.trim() !== "") {
            user.Bio = Bio;
          }
          if (Role !== undefined && Role !== null && Role.trim() !== "") {
            user.Role = Role;
          }          
          
          await user.save();
          return res.status(201).json({ message: "Change user info success" });
        } catch (error) {
          res.status(500).json({ message: "Server error" });
          console.log(error);
        }
      },
      
    updatePro: async (req, res) => {
        try {
            const userId = req.params.UserId;
            const user = await User.findOne({ UserId: userId });
            user.isPro = true;
            await user.save();
            return res.status(200).json({ message: "Updated Pro" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        }
    },
    updateArtist: async (req, res) => {
        try {
            const userId = req.params.UserId;
            const user = await User.findOne({ UserId: userId });
            user.isArtist = true;
            await user.save();
            return res.status(200).json({ message: "Server error" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        }
    },
    // For admin
    searchUser: async (req, res) => {
        try {
            const query = req.query.queries;
            // Use a regular expression to perform a case-insensitive search
            const searchRegex = new RegExp(query, 'i');

            // Search for users based on UserId, userDisplayname, email, and account
            const users = await User.find({
                $or: [
                    { UserId: searchRegex },
                    { Displayname: searchRegex },
                    { Email: searchRegex },
                    { Account: searchRegex }
                ]
            });
            res.status(200).json({ users });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}
function generateUserId() {
    // Generate an 8-digit random number
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);

    // Concatenate the random number with 'UID' prefix
    const userId = `UID${randomNumber}`;

    return userId;
}

// Generate downloadURL for file
function generateDownloadUrl(fileName) {
    const file = storageBucket.file(`user_photo/${fileName}`);

    return file
        .getSignedUrl({
            action: 'read',
            expires: '01-01-2100', //  Expiration date
        })
        .then(([url]) => {
            console.log('Download URL generated successfully:', url);
            return url;
        })
        .catch((error) => {
            console.error('Error generating download URL:', error);
            throw error;
        });
}
// Func Upload Audio Photo
function uploadUserPhoto(file) {
    return new Promise((resolve, reject) => {
        try {
            const fileName = file.originalname;
            const fileStream = require('fs').createReadStream(file.path);
            const fileReference = storageBucket.file(`user_photo/${fileName}`);

            // Upload file to firebase storage.
            fileStream
                .pipe(fileReference.createWriteStream())
                .on('error', (error) => {
                    console.error('Error uploading file:', error);
                    reject(error);
                })
                .on('finish', async () => {
                    console.log('Audio photo uploaded successfully!');

                    // Generate a download URL for the uploaded file
                    const downloadUrl = await generateDownloadUrl(fileName);
                    console.log("downloadurl", downloadUrl);
                    // Resolve the Promise with the download URL
                    resolve(downloadUrl);
                });
        } catch (error) {
            console.error('Error in uploadFile:', error);
            reject(error);
        }
    });
}
module.exports = userController;