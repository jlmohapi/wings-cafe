import React, { useState, useEffect } from "react";

const API_PRODUCTS = "http://localhost:5000/products";
const API_TRANSACTIONS = "http://localhost:5000/transactions";

const ReportingModule = () => {
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

  // ----------------- Sales Summary -----------------
  const salesSummary = products.map(p => {
    const soldQty = transactions
      .filter(t => t.productId === p.id && t.type === "sale")
      .reduce((sum, t) => sum + t.amount, 0);

    const revenue = soldQty * p.price;

    return {
      name: p.name,
      quantitySold: soldQty,
      revenue
    };
  });

  const totalRevenue = salesSummary.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Reporting Module</h2>
      <h3>Sales Summary</h3>

      <table border="1" cellPadding="8" style={{ width: "100%", marginBottom: "2rem" }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity Sold</th>
            <th>Revenue Generated</th>
          </tr>
        </thead>
        <tbody>
          {salesSummary.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantitySold}</td>
              <td>${item.revenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total Revenue: ${totalRevenue.toFixed(2)}</h3>
    </div>
  );
};

export default ReportingModule;
