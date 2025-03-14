const db = require('../db'); 
jest.mock('../emailService', () => ({
    sendEmail: jest.fn(),
}));

const { sendEmail } = require('../emailService'); 
const AssetDraft = require('../model/AssetDraft'); 

describe('AssetDraft Class (Database Integration Tests)', () => {
    let testAssetDraftId; 
    let assetDraftMinId;
    let parentAssetId;
    let childAssetIds = [];
    let assetDraft;
    let parentAsset;
    let childAssets = [];

    afterAll(async () => {
        const allIds = [testAssetDraftId, assetDraftMinId, ...childAssetIds, parentAssetId];
        for (const id of allIds) {
            await db.query('DELETE FROM draftCategLinks WHERE assetDraftId = ?', [id]);
            await db.query('DELETE FROM assetsDraft WHERE id = ?', [id]);   
        };
    });

    test('Should create and save an AssetDraft correctly with max data', async () => {
        const assetDraftData = {
            categoryIds: [1, 2], 
            assetId: 2,
            name: "Test Asset",
            description: "This is a test description",
            isVolunOpp: true,
            volunOppText: "Test volunteering text",
            registrationNote: "Test registration note",
            scheduleNote: "Test schedule note",
            isWheelchairAcc: true,
            languagesOffered: ["English", "French", "abrakadabra"],
            scheduleType: "weekly",
            socialWorkerOnlyNote: "Test social worker only note",
            format: ["Online", "On site", "Group", "Individual", "Drop-in", "Scheduled event", "Self-paced"],
            createdEmail: "test@gmail.com",
            cityName: "Test City",
            address: "123 Test St",
            postCode: "12345",
            longitude: 10.1234,
            latitude: 20.5678,
            transportation: "Test transportation",
            email: ["contact@gmail.com", "contact2@gmail.com"],
            phoneNumber: ["1234567890"],
            website: ["https://example.com"]
        };

        assetDraft = new AssetDraft({ data: assetDraftData });
        await assetDraft.save();

        expect(assetDraft.id).toBeDefined();
        testAssetDraftId = assetDraft.id; // Store for later use

        // Verify it was inserted into the database
        const [rows] = await db.query('SELECT * FROM assetsDraft WHERE id = ?', [testAssetDraftId]);
        expect(rows.length).toBe(1);
        expect(rows[0].name).toBe(assetDraftData.name);
    });

    test('Should create and save an AssetDraft correctly with min data', async () => {
        const assetDraftMinData = {
            categoryIds: [10], 
            name: "Test Min Asset"
        };

        const assetDraftMin = new AssetDraft({ data: assetDraftMinData });
        await assetDraftMin.save();
        assetDraftMinId = assetDraftMin.id;

        //console.log("assetDraftMin", assetDraftMin);
        expect(assetDraftMin.id).toBeDefined();
       
        const [rows] = await db.query('SELECT * FROM assetsDraft WHERE id = ?', [assetDraftMin.id]);
        expect(rows.length).toBe(1);
        expect(rows[0].name).toBe(assetDraftMinData.name);
    });

    test('Should create and save a multilevel AssetDrafts correctly', async () => {
    
            const assetDataArray = [
                {
                    name: 'Parent Asset',
                    categoryIds: [3],
                    description: 'A parent asset',
                    status: 'pending'
                },
                ...Array.from({ length: 3 }, (_, i) => ({
                    name: `Child Asset ${i + 1}`,
                    categoryIds: [3],
                    description: `Child ${i + 1} of Parent Asset`,
                    status: 'pending'
                }))
            ];
        
            const hasChildren = assetDataArray.length > 1;
            const [parentAssetData, ...childrenData] = assetDataArray;
            parentAssetData.hasChildren = hasChildren;
            
            parentAsset = new AssetDraft({ data: parentAssetData });
            await parentAsset.save();
            parentAssetId = parentAsset.id;
        
            for (const childData of childrenData) {
                childData.parentAssetDraftId = parentAssetId;
                childData.parentAssetDraftName = parentAsset.name;
                
                let childAsset = new AssetDraft({ data: childData });
                await childAsset.save();
                childAssetIds.push(childAsset.id);
                childAssets.push(childAsset);
            }
    });

    test('getAllPendingAssets should return correct hierarchical structure', async () => {
        const pendingAssets = await AssetDraft.getAllPendingAssets();
        //console.log("Pending Assets:", pendingAssets);
        expect(pendingAssets).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: testAssetDraftId, name: "Test Asset" }),
                expect.objectContaining({
                    id: parentAssetId,
                    name: 'Parent Asset',
                    children: expect.arrayContaining([
                        expect.objectContaining({ name: 'Child Asset 1' }),
                        expect.objectContaining({ name: 'Child Asset 2' }),
                        expect.objectContaining({ name: 'Child Asset 3' })
                    ])
                })
            ])
        );
    });

    test('getParentWithChildren should return parent with all children', async () => {
        const parentWithChildren = await AssetDraft.getParentWithChildren(parentAssetId);
        //console.log("Parent with children:", parentWithChildren);
        expect(parentWithChildren).toBeDefined();
        expect(parentWithChildren.id).toBe(parentAssetId);
        expect(parentWithChildren.children).toHaveLength(3);
        expect(parentWithChildren.children).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: 'Child Asset 1' }),
                expect.objectContaining({ name: 'Child Asset 2' }),
                expect.objectContaining({ name: 'Child Asset 3' })
            ])
        );
    });

    test('Should retrieve all pending assets', async () => {
        const pendingAssets = await AssetDraft.getAllPendingAssets();
        expect(pendingAssets.length).toBeGreaterThan(1);
        pendingAssets.forEach(asset => {
            expect(asset.status).toBe('pending');
        });
        //console.log('Pending Assets:', pendingAssets);

    });

    test('Should throw a validation error for invalid data', async () => {
        const invalidData = {
            assetId: "INVALID", // Should be a number
            categoryIds: "Not an array", // Should be an array of numbers
            name: "", // Required field
            email: "invalid-email" // Invalid email format
        };

        expect(() => new AssetDraft({ data: invalidData })).toThrow();
    });

    test('changeState() should update the status correctly', async () => {
        await new Promise(res => setTimeout(res, 100));

        await assetDraft.changeState("approved");
        
        expect(assetDraft.status).toBe("approved");

        const retrievedAssetDraft = await AssetDraft.getById(testAssetDraftId);

        expect(retrievedAssetDraft.status).toBe("approved");
    });

    test('sendReply() should call sendEmail with correct parameters', async () => {
       
        await assetDraft.sendReply("Test message");
        expect(sendEmail).toHaveBeenCalledWith(
            "test@gmail.com",
            "Update on the community resource you suggested ",
            "replyOnDraft",
            {
                name: "Test Asset",
                status: "approved",
                body: "Test message",
            }
        );
    });

    
    test('hasCreatedEmail() should return true if createdEmail is not null', () => {
        expect(assetDraft.hasCreatedEmail()).toBe(true);
        assetDraft.createdEmail = null;
        expect(assetDraft.hasCreatedEmail()).toBe(false);
    });

    test('editAssetDraft', async () => {
        const updatedData = {
            id: testAssetDraftId,
            categoryIds: [15, 16, 23], 
            name: "Test edited Asset",
            description: "This is a test description haha",
            isVolunOpp: false,
            registrationNote: "Test registration note changed",
            scheduleNote: "Test schedule note changed",
            createdEmail: "test+3@gmail.com",
            cityName: "Test City Second",
            address: "1234 Test St",
            postCode: "k2b6n8",
            longitude: 13.1333,
            latitude: -20.5678,
            email: ["contact2@gmail.com"],
            phoneNumber: ["1234567890", "1231231234"],
            website: ["https://example.com", "https://example2.com"]
        };
        await assetDraft.editAssetDraft(updatedData);
        const updatedAsset = await AssetDraft.getById(testAssetDraftId);
        expect(updatedAsset.name).toBe("Test edited Asset");
        //console.log("updatedAsset", updatedAsset);

    });

    test('Should retrieve an AssetDraft by ID', async () => {
        const retrievedAssetDraft = await AssetDraft.getById(testAssetDraftId);
        console.log("standalone Asset:", retrievedAssetDraft);
        expect(retrievedAssetDraft).not.toBeNull();
        expect(retrievedAssetDraft.id).toBe(testAssetDraftId);
    });

    test('Should retrieve an ParentAssetDraft by ID', async () => {

        const retrievedAssetDraft = await AssetDraft.getById(parentAssetId);
        console.log("Parent Asset:", retrievedAssetDraft);
        expect(retrievedAssetDraft).not.toBeNull();
        expect(retrievedAssetDraft.id).toBe(parentAssetId);
        expect(retrievedAssetDraft.name).toBe("Parent Asset");
    });

    test('Should retrieve an ChildAssetDraft by ID', async () => {

        const retrievedAssetDraft = await AssetDraft.getById(childAssetIds[1]);
        console.log("Child Asset:", retrievedAssetDraft);
        expect(retrievedAssetDraft).not.toBeNull();
        expect(retrievedAssetDraft.id).toBe(childAssetIds[1]);
        expect(retrievedAssetDraft.name).toBe("Child Asset 2");
    });

    test('Should return null for a non-existent AssetDraft ID', async () => {
        const nonExistentAsset = await AssetDraft.getById(999999); // Assume this ID doesn't exist
        expect(nonExistentAsset).toBeNull();
    });

});
