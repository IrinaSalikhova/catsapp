// backend/server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Example API endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello, cats! Lets make map!!" });
});

// Fallback for any route to load the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
