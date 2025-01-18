// backend/catsserver.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Example API endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello, cats! Lets make map!!" });
});

// API routes
app.use('/api/users', userRoutes);

// Serve the React admin page
app.use('/admin', express.static(path.join(__dirname, '../frontend/adminPage/dist')));

// Fallback to React admin index.html for admin routes
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/adminPage/dist/index.html'));
});

// Fallback for any route to load the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

