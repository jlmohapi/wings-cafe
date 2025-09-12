import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/products";

const StockManagement = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  const handleStockChange = async (productId, type) => {
    const amount = parseInt(prompt(`Enter amount to ${type}:`, "1"), 10);
    if (!amount || amount <= 0) return;

    await fetch(`${API_URL}/${productId}/stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, amount }),
    });

    fetchProducts();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Stock Management</h2>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Current Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.quantity}</td>
                <td>
                  <button onClick={() => handleStockChange(p.id, "add")}>Add Stock</button>{" "}
                  <button onClick={() => handleStockChange(p.id, "deduct")}>Deduct Stock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockManagement;
