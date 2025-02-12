// catsserver.js
require("dotenv").config();
const express = require('express');
const cors = require('cors');

const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const userRoutes = require('./routes/userRoutes');

app.use(cors()); // comment it out if you want to use localhost:5173
app.use(express.json()); 


// const corsOptions = {
//     origin: 'http://localhost:5173', 
//   };
//   app.use(cors(corsOptions)); 


// Serve React static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API routes
app.use('/api/users', userRoutes);

// Example API endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello, cats! Lets make map!!" });
});

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

