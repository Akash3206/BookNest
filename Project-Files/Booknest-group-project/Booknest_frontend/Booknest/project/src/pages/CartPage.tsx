import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function CartPage() {
  const { state, removeFromCart, updateCartQuantity, clearCart, createOrder } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: '',
    paymentMethod: 'credit-card'
  });
  const navigate = useNavigate();

  if (!state.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your cart</h2>
        <Link
          to="/auth"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const cartTotal = state.cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  const cartItemsCount = state.cart.reduce((count, item) => count + item.quantity, 0);

  const handleQuantityChange = (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(bookId);
    } else {
      updateCartQuantity(bookId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!checkoutData.shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    setIsCheckingOut(true);
    
    try {
      const orderId = await createOrder(checkoutData.shippingAddress, checkoutData.paymentMethod);
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Start adding some books to your cart!</p>
        <Link
          to="/books"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link
          to="/books"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Books
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">{cartItemsCount} items in your cart</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {state.cart.map((item) => (
                <div key={item.book.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.book.image}
                      alt={item.book.title}
                      className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Book+Cover';
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.book.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{item.book.author}</p>
                      <p className="text-gray-500 text-sm mb-3">{item.book.genre}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.book.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 bg-gray-100 rounded-lg font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.book.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-gray-900">
                            ${(item.book.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.book.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cartItemsCount} items)</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(cartTotal * 0.1).toFixed(2)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(cartTotal * 1.1).toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="shipping" className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address
                </label>
                <textarea
                  id="shipping"
                  value={checkoutData.shippingAddress}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, shippingAddress: e.target.value }))}
                  placeholder="Enter your full shipping address..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  id="payment"
                  value={checkoutData.paymentMethod}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="credit-card">Credit/Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="apple-pay">Apple Pay</option>
                  <option value="google-pay">Google Pay</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || !checkoutData.shippingAddress.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Checkout • $${(cartTotal * 1.1).toFixed(2)}`
              )}
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Secure checkout powered by BookNest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}