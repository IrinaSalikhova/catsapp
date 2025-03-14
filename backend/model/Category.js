const db = require('../db');

class Category {

  static async getAllCategories() {
      try {
          const [rows] = await db.query('SELECT * FROM categories');
          return rows;
      } catch (error) {
          console.error("Error fetching categories:", error);
          throw error;
      }
  }

  static async getCategoryTree() {
      try {
          const categories = await this.getAllCategories();
          const categoryMap = {};
          const rootCategories = [];

          // Create a map of categories
          categories.forEach(cat => {
              categoryMap[cat.id] = { ...cat, subcategories: [] };
          });

          // Build the tree structure
          categories.forEach(cat => {
              if (cat.parentId) {
                  categoryMap[cat.parentId]?.subcategories.push(categoryMap[cat.id]);
              } else {
                  rootCategories.push(categoryMap[cat.id]);
              }
          });

          return rootCategories;
      } catch (error) {
          console.error("Error building category tree:", error);
          throw error;
      }
  }

  static async getCategoryNamesByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid input: Expected an array of category IDs.");
    }

    try {
        const placeholders = ids.map(() => '?').join(', ');
        const query = `SELECT name FROM categories WHERE id IN (${placeholders})`;
        const [rows] = await db.query(query, ids);
        return rows.map(row => row.name);
    } catch (error) {
        console.error("Error fetching category names by IDs:", error);
        throw error;
    }
}

}

module.exports = Category;