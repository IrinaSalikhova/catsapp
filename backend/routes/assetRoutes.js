const express = require('express');
const AssetDraft = require('../model/AssetDraft');
const {userRateLimiter, authenticateJWT} = require("../middleware");

const router = express.Router();

router.post('/suggestNewAsset', userRateLimiter, async (req, res) => {
    try {
        const {newAssetData} = req.body;

        if (!newAssetData.name || !newAssetData.categories) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const assetDraft = new AssetDraft({ data: newAssetData });
        await assetDraft.save();

        res.status(201).json({ 
            message: 'Thank you! Information is sent for review'
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving asset draft', error: err.message });
    }
});

router.post('/addNewAsset', authenticateJWT, userRateLimiter, async (req, res) => {
    try {
        const {newAssetData} = req.body;
        const createdBy = req.userFromToken.id;

        if (!newAssetData.name || !newAssetData.categories) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const assetDraft = new AssetDraft({ data: newAssetData }); //it will be direct route to asset table after
        await assetDraft.save();

        res.status(201).json({ 
            message: 'Thank you! Information is sent for review'
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving asset draft', error: err.message });
    }
});

module.exports = router;
