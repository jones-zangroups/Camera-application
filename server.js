//server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/CameraApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Image schema
const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const Image = mongoose.model('Image', imageSchema);

// Set up Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new Image({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await newImage.save();
    res.status(200).json({ message: 'Image uploaded successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Route to retrieve all images
app.get('/images', async (req, res) => {
  try {
    const images = await Image.find({});
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
