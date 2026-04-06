import { useEffect, useState, useMemo } from 'react';
import { menuService } from '../../services/menuService';
import '../../styles/Admin.css';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await menuService.getAllMenuItems({ all: true });
      setMenuItems(items);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const sortedItems = useMemo(() => {
    return [...menuItems].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (sortKey === 'price' || sortKey === 'preparationTime') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (sortKey === 'availability') {
        valA = valA ? 1 : 0;
        valB = valB ? 1 : 0;
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [menuItems, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIndicator = (key) => {
    if (sortKey !== key) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  const handleItemUpdated = () => {
    fetchMenuItems();
  };

  return (
    <div className="menu-management">
      <div className="management-header">
        <h2>Menu Management</h2>
        <button
          className="add-btn"
          onClick={() => { setShowAddForm(!showAddForm); setSelectedItem(null); }}
        >
          {showAddForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {showAddForm && (
        <MenuItemForm
          onSaved={() => { setShowAddForm(false); handleItemUpdated(); }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="items-table">
        <table>
          <thead>
            <tr>
              <th className="sortable-th" onClick={() => handleSort('name')}>Name{sortIndicator('name')}</th>
              <th className="sortable-th" onClick={() => handleSort('category')}>Category{sortIndicator('category')}</th>
              <th className="sortable-th" onClick={() => handleSort('price')}>Price{sortIndicator('price')}</th>
              <th className="sortable-th" onClick={() => handleSort('preparationTime')}>Prep Time{sortIndicator('preparationTime')}</th>
              <th className="sortable-th" onClick={() => handleSort('availability')}>Available{sortIndicator('availability')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map(item => (
              <tr
                key={item._id}
                className="clickable-row"
                onClick={() => { setSelectedItem(item); setShowAddForm(false); }}
              >
                <td className="item-name-cell">{item.name}</td>
                <td>{item.category}</td>
                <td className="price-cell">€{Number(item.price).toFixed(2)}</td>
                <td>{item.preparationTime} min</td>
                <td>
                  <span className={`avail-badge ${item.availability ? 'yes' : 'no'}`}>
                    {item.availability ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <MenuItemPopup
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdated={handleItemUpdated}
        />
      )}
    </div>
  );
};

const MenuItemForm = ({ onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '', category: '', description: '', price: '',
    preparationTime: 15, image: '', availability: true
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await menuService.createMenuItem(formData, token);
      onSaved();
    } catch (error) {
      console.error('Failed to create menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="menu-form">
      <div className="form-row">
        <div className="form-group">
          <label>Item Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Preparation Time (minutes)</label>
          <input type="number" name="preparationTime" value={formData.preparationTime} onChange={handleChange} />
        </div>
      </div>
      <div className="form-group full-width">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
      </div>
      <div className="form-group full-width">
        <label>Image URL</label>
        <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
      </div>
      <div className="form-group checkbox">
        <label>
          <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} />
          Available
        </label>
      </div>
      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Saving...' : 'Add Item'}
      </button>
    </form>
  );
};

const MenuItemPopup = ({ item, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: item.name || '',
    category: item.category || '',
    description: item.description || '',
    price: item.price || '',
    preparationTime: item.preparationTime || 15,
    image: item.image || '',
    availability: item.availability !== false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await menuService.updateMenuItem(item._id, formData, token);
      setSuccess('Menu item updated!');
      onUpdated();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await menuService.deleteMenuItem(item._id, token);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete menu item');
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Edit Menu Item</h2>
          <button className="close-panel-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="popup-form-grid">
          <div className="popup-form-group">
            <label>Item Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="popup-form-group">
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} />
          </div>
          <div className="popup-form-group">
            <label>Price (€)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" />
          </div>
          <div className="popup-form-group">
            <label>Prep Time (min)</label>
            <input type="number" name="preparationTime" value={formData.preparationTime} onChange={handleChange} />
          </div>
          <div className="popup-form-group full">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>
          <div className="popup-form-group full">
            <label>Image URL</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </div>
          <div className="popup-form-group checkbox">
            <label>
              <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} />
              Available
            </label>
          </div>
        </div>

        <div className="popup-actions-row">
          <button className="popup-delete-btn" onClick={handleDelete}>Delete Item</button>
          <button className="editor-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
