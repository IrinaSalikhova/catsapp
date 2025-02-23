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
        
        const hasChildren = newAssetData.hasChildren || false;
        const children = newAssetData.children || [];
        
        delete newAssetData.children;

        const parentAssetDraft = new AssetDraft({ data: newAssetData });
        await parentAssetDraft.save();

        if (hasChildren && children.length > 0) {
            for (const child of children) {
                const childData = { 
                    ...child,
                    parentAssetDraftId: parentAssetDraft.id, 
                    parentAssetDraftName: parentAssetDraft.name 
                };
                
                const childAssetDraft = new AssetDraft({ data: childData });
                await childAssetDraft.save();
            }
        }
        res.status(201).json({ 
            message: 'Thank you! Information is sent for review'
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving asset draft', error: err.message });
    }
});

router.post('/reviewAsset', authenticateJWT, userRateLimiter, async (req, res) => {

    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const {reviewedDraftId, reviewDecision, reviewComment} = req.body;

        if (!reviewedDraftId || !reviewDecision) {
            return res.status(400).json({ message: 'Missing information' });
        }

        const assetDraft = await AssetDraft.findById(reviewedDraftId);
        await assetDraft.changeState(reviewDecision);
        if (assetDraft.hasCreatedEmail()) {
            await assetDraft.sendReply(reviewComment);
        }

        // TODO: here add resaving as asset
    

        res.status(201).json({ 
            message: 'Asset reviewed successfully'
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error reviewing asset draft', error: err.message });
    }
});

router.post('/reviewMultilevelAsset', authenticateJWT, userRateLimiter, async (req, res) => {
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const {reviewedDraftId, reviewDecision, reviewComment} = req.body;

        if (!reviewedDraftId || !reviewDecision) {
            return res.status(400).json({ message: 'Missing information' });
        }

        const assetDraft = await AssetDraft.findById(reviewedDraftId);
        await assetDraft.changeState(reviewDecision);
        if (assetDraft.hasCreatedEmail()) {
            await assetDraft.sendReply(reviewComment);
        }

        // TODO: here add resaving as asset
        // TODO: hieraihical logic
    

        res.status(201).json({ 
            message: 'Asset reviewed successfully'
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error reviewing asset draft', error: err.message });
    }
});

router.put('/editAssetDraft', authenticateJWT, userRateLimiter, async (req, res) => {
    
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const {reviewedDraftId, updatedData} = req.body;

        if (!reviewedDraftId || !updatedData) {
            return res.status(400).json({ message: 'Missing information' });
        }

        const assetDraft = await AssetDraft.findById(reviewedDraftId);
        await assetDraft.editAssetDraft(updatedData)

        res.status(201).json({ 
            message: 'Asset updated successfully'
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error reviewing asset draft', error: err.message });
    }
});

router.get('/getAllPendingAssets', authenticateJWT, userRateLimiter, async (req, res) => {

    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const pendingAssets = await AssetDraft.getAllPendingAssets();

        if (!pendingAssets) {
            return res.status(404).json({ message: 'No pending assets found' });
        }
        res.status(200).json({
            pendingAssets
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving pending assets', error: err.message });
    }
});

router.get('/getAssetDraft', authenticateJWT, userRateLimiter, async (req, res) => {
   
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const {draftId} = req.body;

        if (!draftId) {
            return res.status(400).json({ message: 'Missing information about draftId' });
        }

        const assetDraft = await AssetDraft.getById(draftId);

        if (!assetDraft) {
            return res.status(404).json({ message: 'No asset draft found' });
        }
        res.status(200).json({
            assetDraft
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving asset draft', error: err.message });
    }
});

router.get('/getParentAssetDraft', authenticateJWT, userRateLimiter, async (req, res) => {
   
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const {draftId} = req.body;

        if (!draftId) {
            return res.status(400).json({ message: 'Missing information about draftId' });
        }

        const assetDraft = await AssetDraft.getParentWithChildren(draftId);

        if (!assetDraft) {
            return res.status(404).json({ message: 'No asset draft found' });
        }
        res.status(200).json({
            assetDraft
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving asset draft', error: err.message });
    }
});


router.post('/addNewAsset', authenticateJWT, userRateLimiter, async (req, res) => {
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        
        // TODO: here rewrite fully for saving to assets by default
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
