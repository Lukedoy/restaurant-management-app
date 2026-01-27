// src/components/Admin/MenuManagement.jsx
import React, { useEffect, useState } from 'react';
import { menuService } from '../../services/menuService';
import '../../styles/Admin.css';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    preparationTime: 15,
    availability: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await menuService.getAllMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (editingId) {
        await menuService.updateMenuItem(editingId, formData, token);
      } else {
        await menuService.createMenuItem(formData, token);
      }

      fetchMenuItems();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        preparationTime: 15,
        availability: true
      });
    } catch (error) {
      console.error('Failed to save menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        await menuService.deleteMenuItem(id, token);
        fetchMenuItems();
      } catch (error) {
        console.error('Failed to delete menu item:', error);
      }
    }
  };

  return (
    <div className="menu-management">
      <div className="management-header">
        <h2>Menu Management</h2>
        <button 
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              category: '',
              description: '',
              price: '',
              preparationTime: 15,
              availability: true
            });
          }}
        >
          {showForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="menu-form">
          <div className="form-row">
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Preparation Time (minutes)</label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
              />
              Available
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
          </button>
        </form>
      )}

      <div className="items-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Prep Time</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>₹{item.price}</td>
                <td>{item.preparationTime} min</td>
                <td>{item.availability ? '✓' : '✗'}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManagement;





