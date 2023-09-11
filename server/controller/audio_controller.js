const admin = require("firebase-admin");
const serviceAccount = require("../hosting-audio-398017-firebase-adminsdk-rr6x7-6060b64630.json");
const jwt = require('jsonwebtoken');

// Connect firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket:"gs://hosting-audio-398017.appspot.com",
  });
  const storage = admin.storage();
  const storageBucket = storage.bucket();
  
  const audioController = {
    postAudio: async (req, res) => {
        try{
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded.' });
            }
            await uploadFile(file);
            res.json({ message: 'File uploaded successfully!' });
        }catch(error){
            console.error('Error uploading file:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
  }

  function uploadFile(file){
    try{
      const fileName = file.originalname; // Use originalname to get the file name
      const fileReference = storageBucket.file(`audio/${fileName}`);
      
      // Create a readable stream from the uploaded file
      const fileStream = require('fs').createReadStream(file.path);
    
      // Upload the file.
      fileStream.pipe(fileReference.createWriteStream())
        .on('error', (error) => {
          console.error('Error uploading file:', error);
        })
        .on('finish', () => {
          console.log('File uploaded successfully!');
        });
    }catch(error){
      console.log('JWT verification error:', error.message);
    }
  }

module.exports = audioController;