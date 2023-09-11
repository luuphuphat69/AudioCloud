const express = require('express');
const cors = require('cors');
const app = express ();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');

const userRoute = require("./router/user_router");
const audioRoute = require("./router/audio_router");

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
app.use(cors());

// Announce api request
app.use(morgan("common"))

// ROUTE
app.use("/v1/user", userRoute);
app.use("/v1/audio", audioRoute);

app.listen(8000, () => {
   console.log("Server is running");
});