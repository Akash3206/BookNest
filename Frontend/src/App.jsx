// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Register } from "./pages/Register";
import Login from "./pages/Login/Login";
import { BookList } from "./pages/BookList";
import BookDetails from "./pages/BookDetails/BookDetails";
import { CheckOut } from "./pages/CheckOut";
import { OrderHistory } from "./pages/OrderHistory";
import { OrganizerDashboard } from "./pages/OrganizerDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books" element={<BookList />} />

        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/books" element={<BookList />} />
      </Routes>
    </Router>
  );
}

export default App;
