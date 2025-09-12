import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/products";
const LOW_STOCK = 5;

const InventoryModule = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    setProducts(await res.json());
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Inventory Overview</h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "flex-start"
      }}>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((p) => (
            <div key={p.id} style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "220px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              backgroundColor: "#fff"
            }}>
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "6px", marginBottom: "0.5rem" }}
              />
              <h3 style={{ marginBottom: "0.5rem" }}>{p.name}</h3>
              <p><strong>Category:</strong> {p.category}</p>
              <p><strong>Price:</strong> ${Number(p.price).toFixed(2)}</p>
              <p><strong>Quantity:</strong> {Number(p.quantity)}</p>
              <p style={{ color: p.quantity < LOW_STOCK ? "red" : "green", fontWeight: "bold" }}>
                {p.quantity < LOW_STOCK ? "Low Stock" : "OK"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryModule;
