const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/predict-merit', upload.single('file'), (req, res) => {
  const filePath = path.resolve(req.file.path);
  const year = req.body.year || '2025';

  const pythonProcess = spawn('python', ['predict_merit.py', filePath, year]);

  let result = '';
  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.download(result.trim());  // let user download the new file
    } else {
      res.status(500).send('Prediction failed.');
    }
  });
});

module.exports = router;
