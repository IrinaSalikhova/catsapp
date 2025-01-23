const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

// Serve main frontend static files (index.html)
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve admin React static files
app.use('/admin', express.static(path.join(__dirname, '../frontend/adminPage/dist')));

// API routes
app.use('/api/users', userRoutes);

// Example API endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, cats! Let’s make a map!' });
});

// Fallback to main frontend index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});