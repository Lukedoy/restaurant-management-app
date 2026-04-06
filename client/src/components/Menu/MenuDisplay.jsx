
import React, { useEffect, useState } from 'react';
import { menuService } from '../../services/menuService';
import MenuItem from './MenuItem';
import '../../styles/Menu.css';

const MenuDisplay = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const data = await menuService.getAllMenuItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading menu...</div>;

  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' ? items : items.filter(item => item.category === selectedCategory);

  return (
    <div className="menu-display">
      <h2>Our Menu</h2>
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="menu-grid">
        {filteredItems.map(item => (
          <MenuItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuDisplay;