import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function OrdersPage() {
  const { state } = useApp();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!state.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your orders</h2>
        <Link
          to="/auth"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const userOrders = state.orders.filter(order => order.userId === state.user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link
          to="/profile"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Profile
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">{userOrders.length} orders total</p>
        </div>
      </div>

      {userOrders.length > 0 ? (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {order.orderDate}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} items
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setExpandedOrder(
                        expandedOrder === order.id ? null : order.id
                      )}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedOrder === order.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {expandedOrder === order.id && (
                <div className="p-6">
                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.book.id} className="flex items-center space-x-4">
                          <img
                            src={item.book.image}
                            alt={item.book.title}
                            className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Book+Cover';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900">{item.book.title}</h5>
                            <p className="text-gray-600 text-sm">{item.book.author}</p>
                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              ${(item.book.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                              ${item.book.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <p className="text-gray-600 text-sm whitespace-pre-line">
                        {order.shippingAddress}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                      <p className="text-gray-600 text-sm capitalize">
                        {order.paymentMethod.replace('-', ' ')}
                      </p>
                      
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">${(order.total / 1.1).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-medium">${(order.total * 0.1 / 1.1).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="font-medium">Free</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-6">When you place orders, they'll appear here</p>
          <Link
            to="/books"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}