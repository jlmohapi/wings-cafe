import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/products";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
  });

  useEffect(() => { fetchProducts(); }, []);
  const fetchProducts = async () => { const res = await fetch(API_URL); setProducts(await res.json()); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.id) {
      await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setForm({ id: null, name: "", description: "", category: "", price: "", quantity: "" });
    fetchProducts();
  };

  const handleEdit = (p) => setForm(p);
  const handleDelete = async (id) => { await fetch(`${API_URL}/${id}`, { method: "DELETE" }); fetchProducts(); };

  return (
    <div>
      <h2>Product Management</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required /><br />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required /><br />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required /><br />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required /><br />
        <button type="submit">{form.id ? "Update" : "Add"} Product</button>
      </form>

      <h3>Products List</h3>
      <table border="1" cellPadding="8">
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td><td>{p.category}</td><td>{p.price}</td><td>{p.quantity}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>{" "}
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
