// CheckOut.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function CheckOut() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: state.book._id })
    });
    if (res.ok) navigate('/orders');
  };

  return (
    <div>
      <h2>Checkout for {state?.book?.title}</h2>
      <button onClick={handleCheckout}>Confirm Purchase</button>
    </div>
  );
}
