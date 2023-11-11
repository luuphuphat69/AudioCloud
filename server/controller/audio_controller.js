const Audio = require("../model/audio");
const User = require("../model/user");
const Playlist = require("../model/playlist");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

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
      const file = req.files['Audio'][0];
      const photoFile = req.files['Photo'] ? req.files['Photo'][0] : null;
      const { audioName, audioGenre, description, isPublic } = req.body;
      const audioId = generateAudioId();
      const userId = req.params.UserId;

      let audioUrl = null;
      let audioPhotoUrl = null;

      if (file) {
        audioUrl = await uploadAudioFile(file);
      }
      if (photoFile) {
        audioPhotoUrl = await uploadAudioPhoto(photoFile);
      }
      const user = await User.findOne({ UserId: userId });

      const audio = new Audio({
        AudioId: audioId,
        AudioName: audioName,
        UserId: userId,
        Genre: audioGenre,
        Description: description,
        AudioURL: audioUrl,
        PhotoURL: audioPhotoUrl,
        IsPublic: isPublic,
        UserDisplayname: user.Displayname
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
      res.status(201).json({ message: "Delete successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getAllAudio: async (req, res) => {
    try {
      const listAudio = await Audio.find({ IsPublic: true });
      res.status(200).json(listAudio);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  getAudioInfo: async (req, res) => {
    try {
      const audioId = req.params.audioId;
      const filter = { AudioId: audioId };
      const audio = await Audio.findOne(filter);
      res.status(200).json(audio);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  addToPlaylist: async (req, res) => {
    try {
      const audioId = req.params.audioId;
      const playlistId = req.params.playlistId;

      const audio = await Audio.findOne({ AudioId: audioId });
      const playlist = await Playlist.findOne({ PlaylistId: playlistId });
      if (!audio || !playlist) {
        return res.status(404).json({ message: 'Audio or playlist not found' });
      }
      // Check if the audio is already in the playlist
      if (playlist.ListAudio.includes(audioId)) {
        return res.status(400).json({ message: 'Audio is already in the playlist' });
      }
      playlist.ListAudio.push(audioId);
      await playlist.save();
      res.status(200).json({ message: 'Audio added to the playlist' });
    } catch (error) {
      console.log(error);
    }
  },
  editTrack: async(req, res) => {
    try{
      const photoFile = req.files['Photo'] ? req.files['Photo'][0] : null;
      const audioId = req.params.AudioId;
      const {audioName, isPublic, genre, description} = req.body;
      const audio = await Audio.findOne({AudioId: audioId});

      let audioPhotoUrl = null;
      if (photoFile) {
        audioPhotoUrl = await uploadAudioPhoto(photoFile);
      }

      if(audio !== null){
        if(audioName != null){
          audio.AudioName = audioName;
        }
        if(audioPhotoUrl != null){
          audio.PhotoURL = audioPhotoUrl;
        }
        if(genre != null){
          audio.Genre = genre;
        }
        if(description){
          audio.Description = description;
        }
        if(isPublic != null){
          audio.IsPublic = isPublic;
        }
        await audio.save();
        return res.status(200).json({message:"Track Updated"});
      }
    }catch(error){
      console.log(error);
    }
  },
  // Get Top 50 songs by their GERNE
  getTop50: async (req, res) => {
    try {
      const type = req.params.type;
      const topAudio = await Audio.find({ Genre: type, IsPublic: true }).sort({ Plays: -1 }).limit(50);
      res.status(201).json(topAudio);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  // Get Top 100 songs by plays
  getTop100: async (req, res) => {
    try {
      const top100Audio = await Audio.find({ IsPublic: true }).sort({ Plays: -1 }).limit(100);
      res.status(201).json(top100Audio);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  search: async (req, res) => {
    try {
        const filter = req.query.queries;
        const audio = await Audio.find({
            IsPublic: true,
            $or: [
                { AudioName: { $regex: `.*${filter}.*`, $options: 'i' } }, // Case-insensitive search for AudioName
                { UserDisplayname: { $regex: `.*${filter}.*`, $options: 'i' } }, // Case-insensitive search for UserDisplayname
            ],
        }).sort({ Plays: -1 }).limit(100);

        res.status(200).json(audio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
},

  updatePlays: async (req, res) => {
    try {
      const audioId = req.params.audioId;
      const audio = await Audio.findOne({ AudioId: audioId });

      if (audio) {
        if (audio.Plays === undefined) {
          audio.Plays = 1; // If "Plays" doesn't exist, set it to 1
        } else {
          audio.Plays++; // If "Plays" exists, increment it
        }

        await audio.save();
        return res.status(200).json('updated');
      } else {
        return res.status(404).json({ message: "Audio not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getTracks: async (req, res) => {
    try {
      const userId = req.params.UserId;
      const tracks = await Audio.find({ UserId: userId });
      res.status(201).json(tracks);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
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
  const audioId = `AUDIO${randomNumber}`;

  return audioId;
}
module.exports = audioController;