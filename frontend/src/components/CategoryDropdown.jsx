import React, { useEffect, useState, useRef } from 'react';
import '../assets/CategoryDropdown.css';

const CategoryDropdown = ({ onCategorySelect, initialSelectedCategoryIds = [] }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubcategories, setActiveSubcategories] = useState(null);
  const [subMenuPosition, setSubMenuPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  useEffect(() => {
    let categoryTreeFetched;
    const fetchCategories = async () => {
      const cachedCategories = sessionStorage.getItem("cachedCategories");
      const expirationTime = 60 * 60 * 24000; // 24 hour
      if (cachedCategories) {
        const { categories, timestamp } = JSON.parse(cachedCategories);
        if (Date.now() - timestamp < expirationTime) {
          setCategories(categories);
          categoryTreeFetched = categories;
          return;
        }
      }
      try {
        const response = await fetch('/api/categories/tree');
        if (response.ok) {
          const data = await response.json();
          categoryTreeFetched = data.categoryTree;
          setCategories(categoryTreeFetched);
          sessionStorage.setItem("cachedCategories", JSON.stringify({
            categories: categoryTreeFetched,
            timestamp: Date.now(),
          }));
        }
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };
    fetchCategories();

    const flatCategories = [];
    categoryTreeFetched.forEach(category => {
      flatCategories.push(category);
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(subcategory => {
          flatCategories.push(subcategory);
        });
      }
    }); 
    const preselected = flatCategories.filter(category => initialSelectedCategoryIds.includes(category.id));

    setSelectedCategories(preselected);

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
    }
  };

  const handleMouseEnter = (category, event) => {
    if (category.subcategories.length > 0) {
      setActiveSubcategories(category);
      const rect = event.currentTarget.getBoundingClientRect();
      // setSubMenuPosition({ top: rect.top});
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

      <div className="dropdown-header">
        <button type="button" className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {selectedCategories.length > 0 ? selectedCategories.map(c => c.name).join(', ') : 'Select a category'}
        </button>
        {selectedCategories.length > 0 && (
          <button className="clear-button" onClick={clearSelection}>X</button>
        )}
      </div>
      
      {dropdownOpen && (
        <div className="dropdown-content">
          {categories.map((category) => (
            <div 
            key={category.id} 
            className={`category-item ${selectedCategories.some((c) => c.id === category.id) ? 'selected' : ''}`} 
            onMouseEnter={(event) => handleMouseEnter(category, event)}>
              <div 
                className={`category-name ${selectedCategories.some((c) => c.id === category.id) ? 'selected' : ''}`}
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
          style={{ top: `${subMenuPosition.top}px` }}
          onMouseLeave={handleMouseLeave}>
          {activeSubcategories.subcategories.map((subcategory) => (
            <div 
              key={subcategory.id} 
              className={`subcategory-item ${selectedCategories.some((c) => c.id === subcategory.id) ? 'selected' : ''}`}
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
