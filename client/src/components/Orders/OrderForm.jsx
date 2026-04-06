
import React, { useState, useEffect } from 'react';
import { menuService } from '../../services/menuService';
import { orderService } from '../../services/orderService';
import '../../styles/Orders.css';

const OrderForm = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await menuService.getAllMenuItems();
      setMenuItems(items);
    } catch (err) {
      setError('Failed to fetch menu items');
    }
  };

  const handleAddItem = (item) => {
    const existingItem = selectedItems.find(i => i._id === item._id);
    
    if (existingItem) {
      setSelectedItems(selectedItems.map(i =>
        i._id === item._id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter(i => i._id !== itemId));
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setSelectedItems(selectedItems.map(i =>
        i._id === itemId
          ? { ...i, quantity }
          : i
      ));
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!tableNumber) {
      setError('Please select a table number');
      return;
    }

    if (selectedItems.length === 0) {
      setError('Please add at least one item to the order');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        tableNumber: parseInt(tableNumber),
        items: selectedItems.map(item => ({
          menuItemId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          specialRequests: item.specialRequests || ''
        })),
        totalAmount: calculateTotal()
      };

      await orderService.createOrder(orderData, token);
      setSuccess('Order created successfully!');
      setTableNumber('');
      setSelectedItems([]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-form-container">
      <div className="form-section">
        <h2>Create New Order</h2>
        
        <div className="table-selection">
          <label>Table Number</label>
          <input
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Enter table number"
            min="1"
          />
        </div>

        <div className="menu-items-section">
          <h3>Select Items</h3>
          <div className="menu-items-list">
            {menuItems.map(item => (
              <div key={item._id} className="menu-item-row">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>€{item.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddItem(item)}
                  className="add-item-btn"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        
        {selectedItems.length === 0 ? (
          <p className="empty-summary">No items added yet</p>
        ) : (
          <>
            <div className="summary-items">
              {selectedItems.map(item => (
                <div key={item._id} className="summary-item">
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>€{item.price} x {item.quantity}</p>
                  </div>
                  <div className="quantity-control">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Special requests..."
                    value={item.specialRequests || ''}
                    onChange={(e) => setSelectedItems(selectedItems.map(i =>
                      i._id === item._id ? { ...i, specialRequests: e.target.value } : i
                    ))}
                    className="special-requests-input"
                  />
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <h3>Total: €{calculateTotal()}</h3>
            </div>

            <button
              onClick={handleSubmitOrder}
              className="submit-order-btn"
              disabled={loading}
            >
              {loading ? 'Creating Order...' : 'Create Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderForm;

