import React, { useEffect, useState } from 'react';
import '../assets/CategoryDropdown.css';

const CategoryDropdown = ({ onCategorySelect, selectableParents = false }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubcategories, setActiveSubcategories] = useState(null);
  const [subMenuPosition, setSubMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/tree', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data.categoryTree);
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category, event) => {
    event.preventDefault(); 
    event.stopPropagation();
    if (category.subcategories.length > 0 && !selectableParents) {
      if (activeSubcategories && activeSubcategories.id === category.id) {
        setActiveSubcategories(null);
      } else {
        const rect = event.target.getBoundingClientRect();
        setSubMenuPosition({ top: rect.top, left: rect.right });
        setActiveSubcategories(category);
      }
    } else {
      const isAlreadySelected = selectedCategories.some((c) => c.id === category.id);
      const updatedSelectedCategories = isAlreadySelected
        ? selectedCategories.filter((c) => c.id !== category.id)
        : [...selectedCategories, category];
      setSelectedCategories(updatedSelectedCategories);
      onCategorySelect(updatedSelectedCategories);
    }
  };

  return (
    <div className="dropdown-container">
      <button type="button" className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
        {selectedCategories.length > 0
          ? selectedCategories.map((c) => c.name).join(', ')
          : 'Select a category'}
      </button>

      {dropdownOpen && (
        <div className="dropdown-content">
          <div className="category-list">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-item ${
                  selectedCategories.some((c) => c.id === category.id) ? 'selected' : ''
                }`}
                onClick={(event) => handleCategoryClick(category, event)}
              >
                {category.name}
                {category.subcategories.length > 0 && <span className="expand-arrow">▶</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubcategories && (
        <div className="subcategory-menu">
          <div className="category-list">
            {activeSubcategories.subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className={`category-item ${
                  selectedCategories.some((c) => c.id === subcategory.id) ? 'selected' : ''
                }`}
                onClick={(event) => handleCategoryClick(subcategory, event)}
              >
                {subcategory.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
