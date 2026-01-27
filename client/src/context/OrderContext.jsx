// src/context/OrderContext.jsx
import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  const addOrder = (order) => {
    setOrders([...orders, order]);
  };

  const updateOrder = (orderId, updatedData) => {
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, ...updatedData } : order
    ));
  };

  const removeOrder = (orderId) => {
    setOrders(orders.filter(order => order._id !== orderId));
  };

  return (
    <OrderContext.Provider value={{ orders, currentOrder, setCurrentOrder, addOrder, updateOrder, removeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};