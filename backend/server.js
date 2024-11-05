const express = require('express');
const mongoose = require('mongoose');
const dsaRouter = require('./fetch');  // Save the artifact code here

const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use('/api', dsaRouter);

// Replace with your MongoDB URI
const mongoURI = 'mongodb+srv://aryansri666:qwertyuiop123@cluster0.pixhz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // or use your MongoDB Atlas URI

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
});

app.post('/execute', (req, res) => {
    const { code, language } = req.body;
  
    let command;
  
    switch (language) {
      case 'javascript':
        command = `node -e "${code.replace(/"/g, '\\"')}"`;
        break;
      case 'python':
        command = `python -c "${code.replace(/"/g, '\\"')}"`;
        break;
      case 'cpp':
        const tempCppFile = 'temp.cpp';
        const tempExeFile = 'temp.exe';
  
        // Write C++ code to a temporary file
        try {
          fs.writeFileSync(tempCppFile, code);
        } catch (writeError) {
          return res.status(500).send({ error: 'Failed to write C++ code to file' });
        }
  
        // Create a command to compile and execute the C++ code
        command = `g++ ${tempCppFile} -o ${tempExeFile} && ${tempExeFile} && del ${tempCppFile} ${tempExeFile}`; 
        break;
      default:
        return res.status(400).send({ error: 'Language not supported' });
    }
  
    // Execute the command
    exec(command, (error, stdout, stderr) => {
      // Cleanup files if any error occurs
      if (error) {
        console.error(`Execution error: ${stderr || error.message}`);
        return res.status(500).send({ error: stderr || error.message });
      }
  
      // Return the output from the execution
      res.send({ output: stdout });
    });
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});