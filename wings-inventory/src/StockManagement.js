import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/products";

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => { fetchProducts(); }, []);
  const fetchProducts = async () => { const res = await fetch(API_URL); setProducts(await res.json()); };

  const handleStockChange = async (id, type) => {
    if (!id) return alert("Invalid product");
    const amount = parseInt(prompt(`Enter amount to ${type}:`, "1"), 10);
    if (!amount || amount <= 0) return;
    const res = await fetch(`${API_URL}/${id}/stock`, {
      method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({type,amount})
    });
    if (!res.ok) return alert(await res.text());
    fetchProducts();
  };

  return (
    <div>
      <h2>Stock Management</h2>
      <table border="1" cellPadding="8">
        <thead><tr><th>Name</th><th>Stock</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td><td>{p.quantity}</td>
              <td>
                <button onClick={() => handleStockChange(p.id, "add")}>Add</button>{" "}
                <button onClick={() => handleStockChange(p.id, "deduct")}>Deduct</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockManagement;
