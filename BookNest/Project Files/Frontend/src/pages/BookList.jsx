// BookList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('/api/books').then(res => res.json()).then(setBooks);
  }, []);

  return (
    <div>
      <h2>Book Listings</h2>
      {books.map(book => (
        <div key={book._id}>
          <Link to={`/books/${book._id}`}>{book.title}</Link>
        </div>
      ))}
    </div>
  );
}