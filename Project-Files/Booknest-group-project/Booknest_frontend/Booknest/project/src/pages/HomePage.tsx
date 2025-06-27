import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, Users, Award, Truck } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { useApp } from '../contexts/AppContext';

export function HomePage() {
  const { state } = useApp();
  
  const featuredBooks = state.books.filter(book => book.featured).slice(0, 6);
  const newReleases = state.books.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-400 rounded-full opacity-10 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400 rounded-full opacity-15"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-white">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  BookNest
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-gray-100 leading-relaxed">
                Your digital sanctuary for discovering, collecting, and enjoying books from around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/books"
                  className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  Explore Books
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {!state.user && (
                  <Link
                    to="/auth"
                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 text-center"
                  >
                    Join BookNest
                  </Link>
                )}
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-4 transform rotate-3">
                {featuredBooks.slice(0, 4).map((book, index) => (
                  <div
                    key={book.id}
                    className={`transform transition-all duration-700 hover:scale-105 ${
                      index % 2 === 0 ? 'translate-y-4' : '-translate-y-4'
                    }`}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-lg shadow-2xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop&t=${Date.now()}`;
                      }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose BookNest?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of book discovery with our innovative platform designed for modern readers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Book,
                title: 'Vast Collection',
                description: 'Access thousands of books across all genres and categories'
              },
              {
                icon: Users,
                title: 'Community Driven',
                description: 'Join a community of book lovers and share your reading journey'
              },
              {
                icon: Award,
                title: 'Curated Selection',
                description: 'Discover handpicked books and featured recommendations'
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                description: 'Quick and reliable delivery to your doorstep worldwide'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Books</h2>
              <p className="text-gray-600 text-lg">Handpicked selections from our curators</p>
            </div>
            <Link
              to="/books"
              className="hidden sm:flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-lg group"
            >
              View All
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/books"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-lg group"
            >
              View All Books
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Releases Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">New Releases</h2>
            <p className="text-gray-600 text-lg">Discover the latest additions to our collection</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newReleases.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of readers who have made BookNest their digital library home
          </p>
          {!state.user ? (
            <Link
              to="/auth"
              className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors duration-300"
            >
              Create Free Account
            </Link>
          ) : (
            <Link
              to="/books"
              className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors duration-300"
            >
              Continue Browsing
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}