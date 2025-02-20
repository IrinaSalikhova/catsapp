const db = require('../db'); // Ensure this points to your actual DB connection
const AssetDraft = require('../model/AssetDraft'); // Adjust path as necessary

describe('AssetDraft Class (Database Integration Tests)', () => {
    let testAssetDraftId; // Store assetDraft ID for retrieval tests

    afterAll(async () => {
        // Cleanup: Remove the test record from the database
        if (testAssetDraftId) {
            await db.query('DELETE FROM draftCategLinks WHERE assetDraftId = ?', [testAssetDraftId]);
            await db.query('DELETE FROM assetsDraft WHERE id = ?', [testAssetDraftId]);
            
        }
    });

    test('Should create and save an AssetDraft correctly', async () => {
        const assetDraftData = {
            assetId: 1,
            categoryIds: [1, 2], // Assuming these categories exist in your DB
            name: "Test Asset",
            description: "This is a test description",
            isVolunOpp: true,
            volunOppText: "Test volunteering text",
            registrationNote: "Test registration note",
            scheduleNote: "Test schedule note",
            status: "pending",
            createdEmail: "test@gmail.com",
            cityName: "Test City",
            cityCode: "TC123",
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
        if (!testAssetDraftId) return;

        const retrievedAssetDraft = await AssetDraft.getById(testAssetDraftId);
        console.log(retrievedAssetDraft);
        expect(retrievedAssetDraft).not.toBeNull();
        expect(retrievedAssetDraft.id).toBe(testAssetDraftId);
        expect(retrievedAssetDraft.name).toBe("Test Asset");
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
});
