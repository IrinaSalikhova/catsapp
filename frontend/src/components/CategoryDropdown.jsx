import React, { useEffect, useState, useRef } from 'react';
import '../assets/CategoryDropdown.css';

const CategoryDropdown = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubcategories, setActiveSubcategories] = useState(null);
  const [subMenuPosition, setSubMenuPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/tree');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categoryTree);
        }
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };
    fetchCategories();

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setActiveSubcategories(null);
    }
  };

  const handleCategoryClick = (category) => {
    if (category.subcategories.length === 0) {
      const isSelected = selectedCategories.some((c) => c.id === category.id);
      const updatedSelection = isSelected
        ? selectedCategories.filter((c) => c.id !== category.id)
        : [...selectedCategories, category];

      setSelectedCategories(updatedSelection);
      onCategorySelect(updatedSelection);
      setDropdownOpen(false);
      setActiveSubcategories(null);
    }
  };

  const handleMouseEnter = (category, event) => {
    if (category.subcategories.length > 0) {
      setActiveSubcategories(category);
      const rect = event.currentTarget.getBoundingClientRect();
      setSubMenuPosition({ top: rect.top - 180});
    }
  };

  const handleMouseLeave = () => {
    setActiveSubcategories(null);
  };

  const clearSelection = () => {
    setSelectedCategories([]);
    onCategorySelect([]);
    setActiveSubcategories(null);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
        Select a category
      </button>
      {selectedCategories.length > 0 && (
        <button className="clear-button" onClick={clearSelection}>Clear Selection</button>
      )}
      {dropdownOpen && (
        <div className="dropdown-content">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="category-item" 
              onMouseEnter={(event) => handleMouseEnter(category, event)}>
              <div 
                className={category.subcategories.length > 0 ? 'has-subcategories' : ''}
                onClick={() => handleCategoryClick(category)}>
                {category.name}
              </div>
              {category.subcategories.length > 0 && <span className="expand-arrow">▶</span>}
            </div>
          ))}
        </div>
      )}

      {activeSubcategories && (
        <div 
          className="subcategory-menu" 
          style={{ top: `${subMenuPosition.top}px`}}
          onMouseLeave={handleMouseLeave}>
          {activeSubcategories.subcategories.map((subcategory) => (
            <div 
              key={subcategory.id} 
              className="subcategory-item" 
              onClick={() => handleCategoryClick(subcategory)}>
              {subcategory.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
