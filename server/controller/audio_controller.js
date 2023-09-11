const Audio = require("../model/audio");
const admin = require("firebase-admin");
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

// Controller
const audioController = {
  postAudio: async (req, res) => {
    try {
      const file = req.file;
      const audioName = req.body.AudioName;
      const audioGerne = req.body.Gerne;
      const isPublic = req.body.isPublic;
      // .....

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      const downloadUrl = await uploadFile(file);
      const audio = new Audio({
        AudioName: audioName,
        Genre: audioGerne,
        AudioURL: downloadUrl,
        // ......
      });
      await audio.save();
      
      res.json({ message: 'File uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

// Func Upload File
function uploadFile(file) {
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

module.exports = audioController;