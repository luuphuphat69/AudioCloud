const Audio = require("../model/audio");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const serviceAccount = require("../hosting-audio-398017-firebase-adminsdk-rr6x7-6060b64630.json");

// Connect firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://hosting-audio-398017.appspot.com",
});
const storage = admin.storage();
const storageBucket = storage.bucket();

// Generate downloadURL for file
function generateDownloadUrl(fileName) {
  const file = storageBucket.file(`audio/${fileName}`);

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

function generateDownloadUrlForAudioPhoto(fileName) {
  const file = storageBucket.file(`audio_photo/${fileName}`);

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

// Controller
const audioController = {

  postAudio: async (req, res) => {
    try {
      // Get token from cookies when login success
      const token = req.cookies.token;
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      const file = req.files['Audio'][0];
      const photoFile = req.files['Photo'] ? req.files['Photo'][0] : null;
      const audioName = req.body.AudioName;
      const audioGerne = req.body.Genre;
      const isPublic = req.body.isPublic;
      const audioId = generateAudioId();
      const audioPhotoUrl = null;
      const userId = decodedToken.userId;

      if (!file) {
        return res.status(400).json({ message: 'No audio uploaded.' });
      }
      if (photoFile) {
        audioPhotoUrl = await uploadAudioPhoto(photoFile);
      }
      const downloadUrl = await uploadAudioFile(file);

      const audio = new Audio({
        AudioId: audioId,
        AudioName: audioName,
        UserId: userId,
        Genre: audioGerne,
        AudioURL: downloadUrl,
        PhotoURL: audioPhotoUrl,
        IsPublic: isPublic,
      });
      await audio.save();
      res.json({ message: 'File uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  removeAudio: async (req, res) => {
    try {
      const audioId = req.params.audioId;
      const filter = { AudioId: audioId };
      const audio = await Audio.findOne(filter);

      await Audio.deleteOne(audio);
      res.status(201).json({message: "Delete successfully"});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getAllAudio: async (req, res) => {
    try{
      const listAudio = await Audio.find();
      res.status(200).json(listAudio);
    }catch(error){
      res.status(500).json({message: "Server error"});
    }
  },

}

// Func Upload Audio File
function uploadAudioFile(file) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = file.originalname;
      const fileStream = require('fs').createReadStream(file.path);
      const fileReference = storageBucket.file(`audio/${fileName}`);

      // Upload file to firebase storage.
      fileStream
        .pipe(fileReference.createWriteStream())
        .on('error', (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        })
        .on('finish', async () => {
          console.log('File uploaded successfully!');

          // Generate a download URL for the uploaded file
          const downloadUrl = await generateDownloadUrl(fileName);

          // Resolve the Promise with the download URL
          resolve(downloadUrl);
        });
    } catch (error) {
      console.error('Error in uploadFile:', error);
      reject(error);
    }
  });
}

// Func Upload Audio Photo
function uploadAudioPhoto(file) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = file.originalname;
      const fileStream = require('fs').createReadStream(file.path);
      const fileReference = storageBucket.file(`audio_photo/${fileName}`);

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
          const downloadUrl = await generateDownloadUrlForAudioPhoto(fileName);

          // Resolve the Promise with the download URL
          resolve(downloadUrl);
        });
    } catch (error) {
      console.error('Error in uploadFile:', error);
      reject(error);
    }
  });
}
function generateAudioId() {
  // Generate an 8-digit random number
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);

  // Concatenate the random number with 'UID' prefix
  const userId = `AUDIO${randomNumber}`;

  return userId;
}
module.exports = audioController;