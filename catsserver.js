// catsserver.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json()); 


// Serve React static files
app.use(express.static(path.join(__dirname, 'frontend/dist')));


// Example API endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello, cats! Lets make map!!" });
});


// Fallback for React routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

