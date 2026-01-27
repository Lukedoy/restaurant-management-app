// src/components/Menu/MenuItem.jsx
import React, { useState } from 'react';

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <div className="menu-item-card">
      {item.image && <img src={item.image} alt={item.name} className="item-image" />}
      <h3>{item.name}</h3>
      <p className="description">{item.description}</p>
      <p className="category">{item.category}</p>
      <div className="item-footer">
        <span className="price">₹{item.price}</span>
        {onAddToCart && (
          <button onClick={() => onAddToCart(item)} className="add-btn">Add</button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;