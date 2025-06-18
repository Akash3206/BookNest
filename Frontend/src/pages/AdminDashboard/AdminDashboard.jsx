

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    orders: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/stats"); // Secure this with JWT
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-xl font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Users" value={stats.users} link="/admin/users" />
        <DashboardCard title="Books Listed" value={stats.books} link="/admin/books" />
        <DashboardCard title="Orders Placed" value={stats.orders} link="/admin/orders" />
        <DashboardCard title="Revenue" value={`₹${stats.revenue}`} />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <ActionButton to="/admin/books/new" label="Add New Book" />
          <ActionButton to="/admin/users" label="Manage Users" />
          <ActionButton to="/admin/orders" label="View Orders" />
          <ActionButton to="/admin/reports" label="Reports & Analytics" />
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({ title, value, link }) => {
  const content = (
    <div className="bg-white shadow-lg rounded-xl p-5 text-center hover:shadow-xl transition-shadow">
      <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

const ActionButton = ({ to, label }) => (
  <Link
    to={to}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
  >
    {label}
  </Link>
);

