import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;
const PRODUCTS_FILE = "products.json";
const TRANSACTIONS_FILE = "transactions.json";

app.use(cors());
app.use(bodyParser.json());

// ----------------- Helpers -----------------
function loadProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE));
}

function saveProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

function loadTransactions() {
  if (!fs.existsSync(TRANSACTIONS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TRANSACTIONS_FILE));
}

function saveTransactions(transactions) {
  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
}

function getNextProductId(products) {
  if (!products.length) return 1;
  const maxId = Math.max(...products.map(p => p.id));
  return maxId + 1;
}

// ----------------- Product Endpoints -----------------
app.get("/products", (req, res) => res.json(loadProducts()));

app.post("/products", (req, res) => {
  const products = loadProducts();
  const newProduct = {
    id: getNextProductId(products),
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
  };
  products.push(newProduct);
  saveProducts(products);
  res.json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let products = loadProducts();
  products = products.map(p =>
    p.id === id
      ? { ...p, ...req.body, price: Number(req.body.price), quantity: Number(req.body.quantity) }
      : p
  );
  saveProducts(products);
  res.json({ success: true });
});

app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let products = loadProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  res.json({ success: true });
});

// ----------------- Stock Management -----------------
app.post("/products/:id/stock", (req, res) => {
  const id = parseInt(req.params.id);
  const { type, amount } = req.body;
  const qty = parseInt(amount);
  if (!type || qty <= 0) return res.status(400).json({ error: "Invalid type or amount" });

  const products = loadProducts();
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  if (type === "add") product.quantity += qty;
  else if (type === "deduct") {
    if (product.quantity < qty) return res.status(400).json({ error: "Insufficient stock" });
    product.quantity -= qty;
  } else return res.status(400).json({ error: "Invalid type" });

  saveProducts(products);

  const transactions = loadTransactions();
  transactions.push({
    id: Date.now(),
    productId: id,
    type,
    amount: qty,
    date: new Date().toISOString(),
  });
  saveTransactions(transactions);

  res.json(product);
});

// ----------------- Sales -----------------
app.post("/sales", (req, res) => {
  const { productId, quantity } = req.body;
  const products = loadProducts();
  const product = products.find(p => p.id === parseInt(productId));
  const qty = parseInt(quantity);

  if (!product) return res.status(404).json({ error: "Product not found" });
  if (qty <= 0) return res.status(400).json({ error: "Invalid quantity" });
  if (product.quantity < qty) return res.status(400).json({ error: "Insufficient stock" });

  product.quantity -= qty;
  saveProducts(products);

  const transactions = loadTransactions();
  transactions.push({
    id: Date.now(),
    productId: product.id,
    type: "sale",
    amount: qty,
    date: new Date().toISOString(),
  });
  saveTransactions(transactions);

  res.json({ success: true, product, soldQuantity: qty });
});

// ----------------- Transactions -----------------
app.get("/transactions", (req, res) => res.json(loadTransactions()));

// ----------------- Start Server -----------------
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
