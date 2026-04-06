
import React from 'react';

const MenuItem = ({ item }) => {
  return (
    <div className="menu-item-card">
      {item.image && <img src={item.image} alt={item.name} className="item-image" />}
      <h3>{item.name}</h3>
      <p className="description">{item.description}</p>
      <p className="category">{item.category}</p>
      <div className="item-footer">
        <span className="price">€{item.price}</span>
      </div>
    </div>
  );
};

export default MenuItem;