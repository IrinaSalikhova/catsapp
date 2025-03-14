const Category = require('../model/Category');
const db = require('../db');

describe('Category Model - Database Integration Tests', () => {
    beforeAll(async () => {
        // Ensure the database connection is valid
        if (!db || !db.query) {
            throw new Error('Database connection not initialized');
        }
    });

    afterAll(async () => {
        if (db && db.end) {
            await db.end();
        }
    });

    test('getAllCategories should return an array of categories', async () => {
        const categories = await Category.getAllCategories();
        console.log(categories);
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBeGreaterThan(0);
        expect(categories[0]).toHaveProperty('id');
        expect(categories[0]).toHaveProperty('name');
    });

    test('getCategoryTree should return a hierarchical category structure', async () => {
        const categoryTree = await Category.getCategoryTree();
        console.log(categoryTree);
        console.log(categoryTree[0].subcategories[0]);
        expect(Array.isArray(categoryTree)).toBe(true);
        expect(categoryTree.length).toBeGreaterThan(0);
        expect(categoryTree[0]).toHaveProperty('subcategories');
        expect(Array.isArray(categoryTree[0].subcategories)).toBe(true);
    });

    test('getCategoryNamesByIds should return correct category names', async () => {
        const testIds = [1, 2, 3];
        const categoryNames = await Category.getCategoryNamesByIds(testIds);
        console.log(categoryNames);
        expect(Array.isArray(categoryNames)).toBe(true);
        expect(categoryNames.length).toBeGreaterThan(0);
        categoryNames.forEach(name => {
            expect(typeof name).toBe('string');
        });
    });
});
