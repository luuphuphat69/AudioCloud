const express = require('express');
const cors = require('cors');
const app = express ();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const userRoute = require("./router/user_router");
const audioRoute = require("./router/audio_router");
const playlistRoute = require("./router/playlist_router");


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
  origin: "http://localhost:8080", //included origin as true
  credentials: true, //included credentials as true
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

app.get('/getcookie', (req, res) =>{
  res.send(req.cookies);
  console.log(req.cookies);
});

app.listen(8000, () => {
   console.log("Server is running");
});