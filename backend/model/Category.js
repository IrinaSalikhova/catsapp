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
}

module.exports = Category;