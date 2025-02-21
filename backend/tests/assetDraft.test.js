const db = require('../db'); // Ensure this points to your actual DB connection
jest.mock('../emailService', () => ({
    sendEmail: jest.fn(),
}));

const { sendEmail } = require('../emailService'); 
const AssetDraft = require('../model/AssetDraft'); // Adjust path as necessary

describe('AssetDraft Class (Database Integration Tests)', () => {
    let testAssetDraftId; // Store assetDraft ID for retrieval tests
    let assetDraft;

    afterAll(async () => {
        if (testAssetDraftId) {
            await db.query('DELETE FROM draftCategLinks WHERE assetDraftId = ?', [testAssetDraftId]);
            await db.query('DELETE FROM assetsDraft WHERE id = ?', [testAssetDraftId]);   
        }
    });

    test('Should create and save an AssetDraft correctly', async () => {
        const assetDraftData = {
            categoryIds: [1, 2], 
            name: "Test Asset",
            description: "This is a test description",
            isVolunOpp: true,
            volunOppText: "Test volunteering text",
            registrationNote: "Test registration note",
            scheduleNote: "Test schedule note",
            createdEmail: "test@gmail.com",
            cityName: "Test City",
            address: "123 Test St",
            postCode: "12345",
            longitude: 10.1234,
            latitude: 20.5678,
            email: ["contact@gmail.com", "contact2@gmail.com"],
            phoneNumber: ["1234567890"],
            website: ["https://example.com"]
        };

        const assetDraft = new AssetDraft({ data: assetDraftData });
        await assetDraft.save();

        expect(assetDraft.id).toBeDefined();
        testAssetDraftId = assetDraft.id; // Store for later use

        // Verify it was inserted into the database
        const [rows] = await db.query('SELECT * FROM assetsDraft WHERE id = ?', [testAssetDraftId]);
        expect(rows.length).toBe(1);
        expect(rows[0].name).toBe(assetDraftData.name);
    });

    test('Should retrieve an AssetDraft by ID', async () => {

        const retrievedAssetDraft = await AssetDraft.getById(testAssetDraftId);
        console.log(retrievedAssetDraft);
        assetDraft = retrievedAssetDraft;
        expect(retrievedAssetDraft).not.toBeNull();
        expect(retrievedAssetDraft.id).toBe(testAssetDraftId);
        expect(retrievedAssetDraft.name).toBe("Test Asset");
    });

    test('Should retrieve all pending assets', async () => {
        const pendingAssets = await AssetDraft.getAllPendingAssets();
        expect(pendingAssets.length).toBeGreaterThan(1);
        pendingAssets.forEach(asset => {
            expect(asset.status).toBe('pending');
        });
        console.log('Pending Assets:', pendingAssets);

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

    test('Should return null for a non-existent AssetDraft ID', async () => {
        const nonExistentAsset = await AssetDraft.getById(999999); // Assume this ID doesn't exist
        expect(nonExistentAsset).toBeNull();
    });

    test('changeState() should update the status correctly', async () => {
       
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
        console.log("updatedAsset", updatedAsset);

    });
});
