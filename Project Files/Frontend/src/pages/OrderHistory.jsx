// OrderHistory.jsx
import React, { useEffect, useState } from 'react';

export function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/orders/user/me').then(res => res.json()).then(setOrders);
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.map(order => (
        <div key={order._id}>{order.bookTitle} - {order.status}</div>
      ))}
    </div>
  );
}
