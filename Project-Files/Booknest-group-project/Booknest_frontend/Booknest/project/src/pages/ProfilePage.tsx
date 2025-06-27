import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Package, Heart, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function ProfilePage() {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(state.user?.name || '');

  if (!state.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your profile</h2>
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
  const recentOrders = userOrders.slice(0, 3);
  const wishlistBooks = state.books.filter(book => state.wishlist.includes(book.id));

  const handleSaveName = () => {
    if (editedName.trim() && state.user) {
      const updatedUser = { ...state.user, name: editedName.trim() };
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(state.user?.name || '');
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">
                  {state.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-center mb-2">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-center font-semibold"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-gray-900">{state.user.name}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {state.user.email}
                </div>
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {state.user.joinDate}
                </div>
              </div>

              {state.user.role === 'admin' && (
                <div className="mt-4">
                  <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                    Admin
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{userOrders.length}</div>
                <div className="text-sm text-gray-600">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{state.wishlist.length}</div>
                <div className="text-sm text-gray-600">Wishlist</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/orders"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="w-5 h-5 text-indigo-600 mr-3" />
                <span>View All Orders</span>
              </Link>
              <Link
                to="/books"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-5 h-5 text-red-500 mr-3" />
                <span>Browse Books</span>
              </Link>
              {state.user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5 text-purple-600 mr-3" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link
                to="/orders"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Order #{order.id.slice(-8)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{order.items.length} items</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Ordered on {order.orderDate}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders yet</p>
                <Link
                  to="/books"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Start shopping
                </Link>
              </div>
            )}
          </div>

          {/* Wishlist Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
              <span className="text-sm text-gray-600">{wishlistBooks.length} books</span>
            </div>

            {wishlistBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistBooks.slice(0, 6).map((book) => (
                  <div key={book.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Book+Cover';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{book.title}</h4>
                      <p className="text-gray-600 text-xs">{book.author}</p>
                      <p className="text-indigo-600 font-medium text-sm">${book.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Your wishlist is empty</p>
                <Link
                  to="/books"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Browse books
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}