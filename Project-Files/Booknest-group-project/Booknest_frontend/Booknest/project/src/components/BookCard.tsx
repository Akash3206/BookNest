import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  isbn: string;
  publishedYear: number;
  pages: number;
  publisher: string;
  language: string;
  inStock: boolean;
  featured: boolean;
}

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const { state, addToCart, addToWishlist, removeFromWishlist } = useApp();
  
  const isInWishlist = state.wishlist.includes(book.id);
  const isInCart = state.cart.some(item => item.book.id === book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state.user && book.inStock) {
      addToCart(book);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state.user) {
      if (isInWishlist) {
        await removeFromWishlist(book.id);
      } else {
        await addToWishlist(book.id);
      }
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop&t=${Date.now()}`;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          loading="lazy"
        />
        
        {book.featured && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        
        {!book.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {state.user && (
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isInWishlist 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white shadow-md'
            }`}
          >
            <Heart className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {book.title}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(book.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {book.rating} ({book.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ${book.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {book.genre}
            </span>
          </div>
          
          {state.user && book.inStock && (
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isInCart
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}