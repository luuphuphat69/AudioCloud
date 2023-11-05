const User = require('../model/user');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const admin = require("firebase-admin");

const storage = admin.storage();
const storageBucket = storage.bucket();
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
                    const token = jwt.sign({ userId: user.UserId, role: user.Role, userDisplayname: user.Displayname }, process.env.SECRET_KEY, {
                        expiresIn: '1h',
                    });
                    // Save token into cookies
                    res.cookie('token', token, { secure: false, maxAge: (60 * 60 * 24 * 30) * 1000, path: '/', domain:".54.206.75.221" });
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
                        return res.status(400).json({ message: 'Account or Email already exists' });
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
                    res.status(201).json({ message: 'Registration successful', Account, Password, Email });
                });
            });
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
        const filter = { UserId: userId };
        // Use the filter object in the findOne method
        const user = await User.findOne(filter);

        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const userRole = decodedToken.role;

            if (decodedToken) {
                if (userRole == "Admin") {
                    if (user.Role == "Admin") {
                        return res.status(403).json({ message: "You can not delete an admin" });
                    }
                    await User.deleteOne(user);
                    res.status(200).json({ message: 'User deleted successfully.' });
                } else {
                    res.status(403).json({ message: "You're not the admin" });
                }
            } else {
                res.status(500).json({ message: "You haven't login yet!!" });
            }
        } catch (error) {
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
            user.Displayname = Displayname;
            user.Address = Address;
            user.Bio = Bio;

            await user.save();
            return res.status(201).json({ message: "Change user info success" });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
            console.log(error);
        }
    },
    updatePro: async(req, res) => {
        try{
            const userId = req.params.UserId;
            const user = await User.findOne({UserId: userId});
            user.isPro = true;
            await user.save();
            return res.status(200).json({message: "Updated Pro"});
        }catch(err){
            console.log(err);
            return res.status(500).json({message: "Server error"});
        }
    },
    updateArtist: async (req, res) => {
        try{
            const userId = req.params.UserId;
            const user = await User.findOne({UserId: userId});
            user.isArtist = true;
            await user.save();
            return res.status(200).json({message: "Server error"});
        }catch(err){
            console.log(err);
            return res.status(500).json({message: "Server error"});
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