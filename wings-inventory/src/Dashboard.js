import React, { useState, useEffect } from "react";
import "./Dashboard.css"; // Optional: for styling

const API_PRODUCTS = "http://localhost:5000/products";
const API_TRANSACTIONS = "http://localhost:5000/transactions";

const LOW_STOCK_THRESHOLD = 5;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(API_PRODUCTS);
    setProducts(await res.json());
  };

  const fetchTransactions = async () => {
    const res = await fetch(API_TRANSACTIONS);
    setTransactions(await res.json());
  };

  const lowStock = products.filter(p => Number(p.quantity) < LOW_STOCK_THRESHOLD);

  const totalSales = transactions
    .filter(t => t.type === "sale")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="dashboard-container" style={{ padding: "1rem" }}>
      <h2>Dashboard</h2>

      {/* Quick Stats */}
      <div className="stats-container" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div className="stat-card" style={cardStyle}>
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>
        <div className="stat-card" style={cardStyle}>
          <h3>Low Stock Items</h3>
          <p>{lowStock.length}</p>
        </div>
        <div className="stat-card" style={cardStyle}>
          <h3>Total Sales</h3>
          <p>{totalSales}</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: "#f4f4f4",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  minWidth: "200px",
  textAlign: "center"
};

export default Dashboard;
