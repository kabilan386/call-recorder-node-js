const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.amr`);
  },
});

const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log(`File uploaded: ${req.file.filename}`);
  res.status(200).send('File uploaded successfully.');
});

// Basic route for testing
app.get('/', (req, res) => {
  res.status(200).json('Call Recording Server is running.');
});

app.get('/check', (req, res) => {
  res.status(200).json('Call Recording Server is running.');
});

app.get('/sample', (req, res) => {
  const sampleFilePath = path.join(__dirname, 'uploads', 'text.txt'); 

  if (fs.existsSync(sampleFilePath)) {
    res.download(sampleFilePath, 'text.txt', (err) => {
      if (err) {
        console.error('Error sending sample file:', err);
        res.status(500).send('Error sending sample file.');
      }
    });
  } else {
    res.status(404).send('Sample file not found.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});