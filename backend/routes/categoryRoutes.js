const express = require('express');
const bcrypt = require('bcryptjs');
const Category = require('../model/Category');
const {userRateLimiter} = require("../middleware");

const router = express.Router();

router.get('/tree', userRateLimiter, async (req, res) => {
    
    try {
        const categoryTree = await Category.getCategoryTree();
        
        res.status(200).json({ 
            categoryTree: categoryTree
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
});

module.exports = router;
