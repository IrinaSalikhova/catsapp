const db = require('../db');
const util = require('util');
const { DataTypes, Model } = require('sequelize');

const queryAsync = util.promisify(db.query).bind(db);

class Category extends Model {
    /**
     * Fetch all categories from the database
     * @returns {Promise<Array>} - List of categories
     */
    static async getAllCategories() {
      try {
        return await queryAsync('SELECT * FROM categories');
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    }
  
    /**
     * Construct category tree from flat list
     * @returns {Promise<Array>} - Hierarchical category tree
     */
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
