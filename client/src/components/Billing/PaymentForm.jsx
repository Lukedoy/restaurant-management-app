
import React, { useState } from 'react';
import apiCall from '../../services/api';
import '../../styles/Billing.css';

const PaymentForm = ({ orderId, totalAmount, discount = 0, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.length !== 16) {
      setError('Invalid card number');
      return false;
    }
    if (!cardDetails.cardName) {
      setError('Card holder name is required');
      return false;
    }
    if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      setError('Invalid expiry date (MM/YY)');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      setError('Invalid CVV');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'card' && !validateCardDetails()) {
      return;
    }

    setLoading(true);

    try {
      await apiCall('PUT', `/orders/${orderId}/payment`, {
        paymentMethod,
        paymentStatus: 'completed',
        discount
      });
      onPaymentSuccess && onPaymentSuccess();
    } catch (err) {
      setError(err.message || 'Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h3>Payment Details</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="payment-method-group">
          <label>
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash
          </label>
          <label>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Card
          </label>
          <label>
            <input
              type="radio"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Online
          </label>
        </div>

        {paymentMethod === 'card' && (
          <div className="card-details">
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                maxLength="16"
              />
            </div>

            <div className="form-group">
              <label>Card Holder Name</label>
              <input
                type="text"
                name="cardName"
                value={cardDetails.cardName}
                onChange={handleCardChange}
                placeholder="John Doe"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="123"
                  maxLength="3"
                />
              </div>
            </div>
          </div>
        )}

        <div className="payment-amount">
          <h4>Total Amount: €{totalAmount.toFixed(2)}</h4>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="pay-btn" disabled={loading}>
          {loading ? 'Processing...' : `Pay €${totalAmount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;