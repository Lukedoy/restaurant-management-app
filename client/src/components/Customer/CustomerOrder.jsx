import React, { useState, useEffect, useCallback } from 'react';
import { menuService } from '../../services/menuService';
import apiCall from '../../services/api';
import '../../styles/Customer.css';

const CustomerOrder = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [isTakeaway, setIsTakeaway] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCart, setShowCart] = useState(false);

  const fetchMenu = useCallback(async () => {
    try {
      const items = await menuService.getAllMenuItems();
      setMenuItems(items);
    } catch (err) {
      setError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, specialRequests: '' }];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i._id !== itemId));
    } else {
      setCart(prev => prev.map(i => i._id === itemId ? { ...i, quantity } : i));
    }
  };

  const updateSpecialRequests = (itemId, text) => {
    setCart(prev => prev.map(i => i._id === itemId ? { ...i, specialRequests: text } : i));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = async () => {
    if (!isTakeaway && !tableNumber) {
      setError('Please enter your table number or select takeaway');
      return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setOrderLoading(true);
    setError('');
    try {
      await apiCall('POST', '/orders', {
        tableNumber: isTakeaway ? 0 : parseInt(tableNumber),
        items: cart.map(item => ({
          menuItemId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          specialRequests: item.specialRequests || ''
        })),
        totalAmount: cartTotal
      });
      setSuccess('Order placed successfully! Your food will be prepared shortly.');
      setCart([]);
      setTableNumber('');
      setShowCart(false);
      setTimeout(() => setSuccess(''), 6000);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please ask your waiter for help.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-loading" role="status">
        <div className="customer-loading-spinner"></div>
        <p>Loading our menu...</p>
      </div>
    );
  }

  return (
    <div className="customer-order">
      <header className="customer-header">
        <div className="customer-header-content">
          <h1>Our Menu</h1>
          <p>Fresh, delicious food prepared with care</p>
        </div>
        <button
          className="cart-toggle-btn"
          onClick={() => setShowCart(!showCart)}
          aria-label={`Cart: ${cartCount} items`}
        >
          <span className="cart-icon">&#128722;</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </header>

      {success && (
        <div className="customer-success animate-fade-in" role="alert">
          <span>&#10003;</span> {success}
        </div>
      )}
      {error && (
        <div className="customer-error animate-fade-in" role="alert">
          {error}
          <button onClick={() => setError('')} aria-label="Dismiss error">&#10005;</button>
        </div>
      )}

      <nav className="customer-categories" role="tablist" aria-label="Menu categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`customer-category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            role="tab"
            aria-selected={selectedCategory === cat}
          >
            {cat}
          </button>
        ))}
      </nav>

      <div className={`customer-layout ${showCart ? 'cart-open' : ''}`}>
        <div className="customer-menu-grid" role="list">
          {filteredItems.map(item => (
            <div key={item._id} className="customer-menu-card animate-fade-in" role="listitem">
              {item.image && (
                <div className="customer-card-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
              )}
              <div className="customer-card-body">
                <h3>{item.name}</h3>
                {item.description && <p className="customer-card-desc">{item.description}</p>}
                <div className="customer-card-footer">
                  <span className="customer-card-price">€{item.price.toFixed(2)}</span>
                  <span className="customer-card-time">{item.preparationTime} min</span>
                </div>
                <button
                  className="customer-add-btn"
                  onClick={() => addToCart(item)}
                  aria-label={`Add ${item.name} to cart`}
                >
                  + Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {}
        <aside className={`customer-cart ${showCart ? 'open' : ''}`} aria-label="Your order">
          <div className="customer-cart-header">
            <h2>Your Order</h2>
            <button className="cart-close-btn" onClick={() => setShowCart(false)} aria-label="Close cart">
              &#10005;
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="customer-cart-empty">
              <p>No items yet. Browse the menu and add items!</p>
            </div>
          ) : (
            <>
              <div className="customer-cart-items">
                {cart.map(item => (
                  <div key={item._id} className="customer-cart-item">
                    <div className="cart-item-header">
                      <h4>{item.name}</h4>
                      <span className="cart-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="cart-item-controls">
                      <div className="cart-qty-control">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >-</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                    </div>
                    <input
                      type="text"
                      className="cart-special-input"
                      placeholder="Special requests..."
                      value={item.specialRequests}
                      onChange={(e) => updateSpecialRequests(item._id, e.target.value)}
                      aria-label={`Special requests for ${item.name}`}
                    />
                  </div>
                ))}
              </div>

              <div className="customer-cart-footer">
                <div className="cart-order-type">
                  <label className="takeaway-toggle">
                    <input
                      type="checkbox"
                      checked={isTakeaway}
                      onChange={(e) => { setIsTakeaway(e.target.checked); if (e.target.checked) setTableNumber(''); }}
                    />
                    Takeaway Order
                  </label>
                </div>
                {!isTakeaway && (
                  <div className="cart-table-input">
                    <label htmlFor="customer-table">Table Number</label>
                    <input
                      id="customer-table"
                      type="number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Your table #"
                      min="1"
                      required
                    />
                  </div>
                )}
                <div className="cart-total">
                  <span>Total</span>
                  <span className="cart-total-amount">€{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  className="cart-checkout-btn"
                  onClick={placeOrder}
                  disabled={orderLoading || cart.length === 0}
                >
                  {orderLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {}
      {cartCount > 0 && !showCart && (
        <button
          className="floating-cart-btn"
          onClick={() => setShowCart(true)}
          aria-label={`Open cart with ${cartCount} items, total €${cartTotal.toFixed(2)}`}
        >
          <span>&#128722; View Order ({cartCount})</span>
          <span>€{cartTotal.toFixed(2)}</span>
        </button>
      )}
    </div>
  );
};

export default CustomerOrder;
