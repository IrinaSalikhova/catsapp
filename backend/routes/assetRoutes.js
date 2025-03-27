const express = require('express');
const AssetDraft = require('../model/AssetDraft');
const Asset = require('../model/Asset');
const {userRateLimiter, authenticateJWT} = require("../middleware");

const router = express.Router();

router.post('/suggestNewAsset', userRateLimiter, async (req, res) => {
    try {
        const { newAssetData } = req.body;

        if (!Array.isArray(newAssetData) || newAssetData.length === 0) {
            return res.status(400).json({ message: 'Invalid asset data format' });
        }

        const hasChildren = newAssetData.length > 1;
        const [parentAsset, ...children] = newAssetData;

        if (!parentAsset.name || !Array.isArray(parentAsset.categoryIds) || parentAsset.categoryIds.length === 0) {
            return res.status(400).json({ message: 'Missing or invalid required fields' });
        }

        parentAsset.hasChildren = hasChildren;
        
        const parentAssetDraft = new AssetDraft({ data: parentAsset });
        await parentAssetDraft.save();

        await Promise.all(children.map(async (child) => {
            const childData = { 
                ...child,
                parentAssetDraftId: parentAssetDraft.id, 
                parentAssetDraftName: parentAssetDraft.name 
            };
            const childAssetDraft = new AssetDraft({ data: childData });
            return childAssetDraft.save();
        }));

        res.status(201).json({ 
            message: 'Thank you! Information is sent for review'
        });
    } catch (err) {
        console.error('Error saving asset draft:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

router.post('/recommendChange', userRateLimiter, async (req, res) => {
    try {
        const { editAssetData } = req.body;

        if (!Array.isArray(editAssetData) || editAssetData.length === 0) {
            return res.status(400).json({ message: 'Invalid asset data format' });
        }

        const hasChildren = editAssetData.length > 1;
        const [parentAssetData, ...children] = editAssetData;

        if (!parentAssetData.name || !Array.isArray(parentAssetData.categoryIds) || parentAssetData.categoryIds.length === 0) {
            return res.status(400).json({ message: 'Missing or invalid required fields' });
        }
    
        const assetId = parentAssetData.id;
        delete parentAssetData.id;
    
        let parentAssetDraft;
        
        if (!parentAssetData.draftId) {
            parentAssetDraft = new AssetDraft({ data: parentAssetData });
            parentAssetDraft.hasChildren = hasChildren;
            parentAssetData.assetId = assetId;
            await parentAssetDraft.save();
        } else {
            parentAssetDraft = await AssetDraft.getById(parentAssetData.draftId);
            if (!parentAssetDraft) {
                parentAssetDraft = new AssetDraft({ data: parentAssetData });
                parentAssetDraft.hasChildren = hasChildren;
                parentAssetData.assetId = assetId;
                await parentAssetDraft.save();
            } else {
                parentAssetDraft.hasChildren = hasChildren;
                parentAssetData.assetId = assetId;
                await parentAssetDraft.editAssetDraft(parentAssetData);
            }
        }

        await Promise.all(children.map(async (child) => {
            let childData;
            let childAssetDraft;
            if (!child.id) {
                childData = { 
                    ...child,
                    parentAssetDraftId: parentAssetDraft.id
                }
                childAssetDraft = new AssetDraft({ data: childData });
                await childAssetDraft.save();
            } else {
                const childAssetId = child.id;
                delete child.id;
                childData = { 
                    ...child,
                    parentAssetDraftId: parentAssetDraft.id,
                    assetId: childAssetId
                }
                childAssetDraft = await AssetDraft.getById(childAssetId);
                if (!childAssetDraft) {
                    childAssetDraft = new AssetDraft({ data: childData });
                    await childAssetDraft.save();
                } else {
                    await childAssetDraft.editAssetDraft(childData);
                }
            }
            return
        }));

        res.status(201).json({ 
            message: 'Thank you! Information is sent for review'
        });
    } catch (err) {
        console.error('Error saving asset draft:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

router.post('/addNewAsset', authenticateJWT, userRateLimiter, async (req, res) => {
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        
        const { newAssetData } = req.body;

        if (!parentData.name || !Array.isArray(parentData.categoryIds) || parentData.categoryIds.length === 0) {
            return res.status(400).json({ message: 'Missing or invalid required fields' });
        }

        const createdBy = req.userFromToken.id;

        const hasChildren = newAssetData.length > 1;
        const [parentData, ...children] = newAssetData;

        if (!parentData.name || !parentData.categoryIds) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        parentData.hasChildren = hasChildren;
        
        const parentAsset = new Asset({ data: parentData });
        await parentAsset.save(createdBy);

        await Promise.all(children.map(async (child) => {
            const childData = { 
                ...child,
                parentAssetId: parentAsset.id, 
                parentAssetName: parentAsset.name 
            };
            const childAsset = new Asset({ data: childData });
            return childAsset.save(createdBy);
        }));

        res.status(201).json({ 
            message: 'Thank you! Information saved successfully'
         });
    } catch (err) {
        console.error('Error saving new asset:', err);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

router.post('/reviewStandaloneDraft', authenticateJWT, userRateLimiter, async (req, res) => {
// should work for both new and edited
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const {reviewedDraftId, reviewDecision, reviewComment} = req.body;
        const createdBy = req.userFromToken.id;

        if (!reviewedDraftId || !reviewDecision) {
            return res.status(400).json({ message: 'Missing information' });
        }
        if (!['approved', 'rejected'].includes(reviewDecision)) {
            return res.status(400).json({ message: 'Invalid review decision' });
        }

        const assetDraft = await AssetDraft.getById(reviewedDraftId);
        
        if (!assetDraft) {
            return res.status(404).json({ message: 'Asset draft not found' });
        }

        if (reviewDecision === 'approved') {
            if (assetDraft.assetId) {
                const asset = await Asset.getById(assetDraft.assetId);
                if (!asset) {
                    const asset = new Asset({data: assetDraft});
                    await asset.save(createdBy);
                    await assetDraft.editAssetDraft({assetId: asset.id});
                } else {
                await asset.editAsset(assetDraft, createdBy);
                }

            }
            else {
                const asset = new Asset({data: assetDraft});
                await asset.save(createdBy);
            }
            
            await assetDraft.changeState(reviewDecision);
            if (assetDraft.hasCreatedEmail()) {
                await assetDraft.sendReply(reviewComment);
            }
        } else {
            await assetDraft.changeState(reviewDecision);
            if (assetDraft.hasCreatedEmail()) {
                await assetDraft.sendReply(reviewComment);
            }
        }

        res.status(201).json({ 
            message: 'Asset reviewed successfully'
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error reviewing asset draft', error: err.message });
    }
});

router.post('/reviewMultilevelAsset', authenticateJWT, userRateLimiter, async (req, res) => {
    // should work for both new and edited
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const {reviewedParentDraftId, reviewDecision, reviewComment} = req.body;
        const createdBy = req.userFromToken.id;

        if (!reviewedParentDraftId || !reviewDecision) {
            return res.status(400).json({ message: 'Missing information' });
        }
        if (!['approved', 'rejected'].includes(reviewDecision)) {
            return res.status(400).json({ message: 'Invalid review decision' });
        }

        const parentAssetDraftTree = await AssetDraft.getParentWithChildren(reviewedParentDraftId);
        if (!parentAssetDraftTree) {
            return res.status(404).json({ message: 'Asset draft not found' });
        }

        const hasChildren = parentAssetDraftTree.children.length > 0;
        const { children, ...parentAssetDraft } = parentAssetDraftTree;
        
        let parentAsset;
        
        if (reviewDecision === 'approved') {
            if (parentAssetDraft.assetId) {
                parentAsset = await Asset.getById(parentAssetDraft.assetId);
                if (!parentAsset) { 
                    parentAsset = new Asset({data: parentAssetDraft});
                    parentAsset.hasChildren = hasChildren;
                    await parentAsset.save(createdBy);
                    await parentAssetDraft.editAssetDraft({assetId: parentAsset.id});

                } else {
                    await parentAsset.editAsset(parentAssetDraft, createdBy);
                }
            }
            else {
                parentAsset = new Asset({data: parentAssetDraft});
                parentAsset.hasChildren = hasChildren;
                await parentAsset.save(createdBy);
            }

            await Promise.all(children.map(async (child) => {
                if (child.assetId) {
        
                    const childAsset = await Asset.getById(child.assetId);
                    if (!childAsset) {
                        childAsset = new Asset({ data: child });
                        childAsset.parentAssetId = parentAsset.id;
                        await childAsset.save(createdBy);
                        await child.editAssetDraft({ assetId: childAsset.id });
                    } else {
                        childAsset.parentAssetId = parentAsset.id;
                        await childAsset.editAsset(child, createdBy);
                    }
                } else {
                    const childAsset = new Asset({ data: child});
                    childAsset.parentAssetId = parentAsset.id;
                    await childAsset.save(createdBy);
                }
                return child.changeState(reviewDecision);
            }));
        
            await parentAssetDraft.changeState(reviewDecision);
            if (parentAssetDraft.hasCreatedEmail()) {
                await parentAssetDraft.sendReply(reviewComment);
            }
        } else {
            await parentAssetDraft.changeState(reviewDecision);
            if (parentAssetDraft.hasCreatedEmail()) {
                await parentAssetDraft.sendReply(reviewComment);
            }
        }

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
        const {editedAssetDraftData} = req.body;

        if (!Array.isArray(editedAssetDraftData) || editedAssetDraftData.length === 0) {
            return res.status(400).json({ message: 'Invalid asset data format' });
        }
        const hasChildren = editedAssetDraftData.length > 1;
        const [parentDraftAsset, ...children] = editedAssetDraftData;

        if (!editedAssetDraftData.name || !editedAssetDraftData.categoryIds || editedAssetDraftData.categoryIds.length === 0) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const parentAssetDraft = await AssetDraft.getById(parentDraftAsset.id);
        if (!parentAssetDraft) {
            parentAssetDraft = new AssetDraft({ data: parentDraftAsset });
            parentAssetDraft.hasChildren = hasChildren;
            await parentAssetDraft.save();
        } else {
            parentAssetDraft.hasChildren = hasChildren;
            await parentAssetDraft.editAssetDraft(parentDraftAsset);
        }
        

        await Promise.all(children.map(async (child) => {
            const childData = { 
                ...child,
                parentAssetDraftId: parentAssetDraft.id
            };
            if (!child.id) {
                const childAssetDraft = new AssetDraft({ data: childData });
                await childAssetDraft.save();
            } else {
                const childAssetDraft = await AssetDraft.getById(child.id);
                if (!childAssetDraft) {
                    const childAssetDraft = new AssetDraft({ data: childData });
                    await childAssetDraft.save();
                } else {
                    await childAssetDraft.editAssetDraft(childData);
                }
            }
            return
        }));
        

        res.status(201).json({ 
            message: 'Asset draft updated successfully'
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error editing asset draft', error: err.message });
    }

});

router.put('/editAsset', authenticateJWT, userRateLimiter, async (req, res) => {
    
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const {editedAssetData} = req.body;

        if (!Array.isArray(editedAssetData) || editedAssetData.length === 0) {
            return res.status(400).json({ message: 'Invalid asset data format' });
        }
        const hasChildren = editedAssetData.length > 1;
        const [parentData, ...children] = editedAssetData;

        if (!editedAssetData.name || !editedAssetData.categoryIds || editedAssetData.categoryIds.length === 0) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const parentAsset = await Asset.getById(parentData.id);
        if (!parentAsset) {
            parentAsset = new Asset({ data: parentData });
            parentAsset.hasChildren = hasChildren;
            await parentAsset.save();
        } else {
            parentAsset.hasChildren = hasChildren;
            await parentAsset.editAsset(parentData);
        }
        
        await Promise.all(children.map(async (child) => {
            const childData = { 
                ...child,
                parentAssetId: parentAsset.id
            };
            if (!child.id) {
                const childAsset = new Asset({ data: childData });
                await childAsset.save();
            } else {
                const childAsset = await Asset.getById(child.id);
                if (!childAsset) {
                    const childAsset = new Asset({ data: childData });
                    await childAsset.save();
                } else {
                    await childAsset.editAsset(childData);
                }
            }
            return
        }));
        
        res.status(201).json({ 
            message: 'Asset  updated successfully'
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error editing asset', error: err.message });
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

router.get('/getAllEnabledAssets', userRateLimiter, async (req, res) => {

    try {
        const allAssets = await Asset.getAllEnabledAssets();

        if (!allAssets) {
            return res.status(404).json({ message: 'No assets found' });
        }
        res.status(200).json({
            allAssets
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving assets', error: err.message });
    }
});


router.get('/getAssetDraft', authenticateJWT, userRateLimiter, async (req, res) => {
   
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const draftId = req.headers['draftId'];

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

router.get('/getAsset', userRateLimiter, async (req, res) => {
   
    try {
        const assetId = req.headers['assetId'];

        if (!assetId) {
            return res.status(400).json({ message: 'Missing information about assetId' });
        }

        const asset = await Asset.getById(assetId);

        if (!asset) {
            return res.status(404).json({ message: 'No asset found' });
        }
        res.status(200).json({
            asset
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving asset ', error: err.message });
    }
});

router.get('/getParentAssetDraftTree', authenticateJWT, userRateLimiter, async (req, res) => {
   
    try {
        if (req.userFromToken.role !== 'navigator') {
            return res.status(403).json({ message: 'Access denied: Navigators only' });
        }
        const draftId = req.headers['draftid'];

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

router.get('/getParentAssetTree', userRateLimiter, async (req, res) => {
   
    try {
        const assetId = req.headers['assetId'];

        if (!assetId) {
            return res.status(400).json({ message: 'Missing information about assetId' });
        }

        const asset = await Asset.getParentWithChildren(assetId);

        if (!asset) {
            return res.status(404).json({ message: 'No asset found' });
        }
        res.status(200).json({
            asset
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving asset', error: err.message });
    }
});

router.post('/findAssets', userRateLimiter, async (req, res) => {
    try {
        const { categoryIds, isVolunOpp, searchPhrase } = req.body;
        
        const parsedCategoryIds = categoryIds ? categoryIds : [];
        const parsedIsVolunOpp = isVolunOpp === true;
        const parsedSearchPhrase = searchPhrase ? searchPhrase.trim() : "";
        console.log(parsedCategoryIds, parsedIsVolunOpp, parsedSearchPhrase);
        if (parsedCategoryIds.length === 0 && !parsedIsVolunOpp && parsedSearchPhrase === "") {
            const allAssets = await Asset.getAllEnabledAssets();
            return res.status(200).json({ assets: allAssets });
        }
        
        const filteredAssets = await Asset.searchAssets({
            categoryIds: parsedCategoryIds,
            isVolunOpp: parsedIsVolunOpp,
            searchPhrase: parsedSearchPhrase
        });
        
        res.status(200).json({ assets: filteredAssets });
    } catch (err) {
        console.error("Error in findAssets route:", err);
        res.status(500).json({ message: 'Error retrieving assets', error: err.message });
    }
});



module.exports = router;
