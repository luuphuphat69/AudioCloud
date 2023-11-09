const express = require('express');
const cors = require('cors');
const app = express ();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const admin = require("firebase-admin");
const serviceAccount = require("./hosting-audio-398017-firebase-adminsdk-rr6x7-6060b64630.json");

// Connect firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://hosting-audio-398017.appspot.com",
});

const userRoute = require("./router/user_router");
const audioRoute = require("./router/audio_router");
const playlistRoute = require("./router/playlist_router");
const favouriteRoute = require('./router/userfav_router');
const commentRoute = require('./router/comment_router');
const historyRoute = require('./router/history_router');

// Load environment variables from .env file
dotenv.config();

// Connection string
const mongoURI = process.env.MONGO_DATABASE;

// Connect to MongoDB 
(async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();

app.use(bodyParser.json({limit: "50mb"}));

const corsOptions = {
  origin: ["http://audiocloud.asia:8080", "http://audiocloud.asia:3000", "http://localhost:8080"],
  credentials: true, //included credentials as true
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
};
app.use(cors(corsOptions));


// Announce api request
app.use(morgan("common"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECURE_FLAG));

// ROUTE
app.use("/v1/user", userRoute);
app.use("/v1/audio", audioRoute);
app.use("/v1/playlist", playlistRoute);
app.use("/v1/fav", favouriteRoute);
app.use("/v1/comment", commentRoute);
app.use("/v1/history", historyRoute);

app.get('/get-cookies', (req, res) =>{
  res.send(req.cookies.token);
  console.log(req.cookies);
});

app.get('/set-cookies', (req, res) => {
  res.send('hello', 'this is test cookie');
})

app.listen(8000, () => {
   console.log("Server is running");
});