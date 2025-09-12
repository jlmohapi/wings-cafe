import React, { useState, useEffect } from "react";
const API_URL = "http://localhost:5000";

const SalesModule = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(()=>{ fetchProducts(); },[]);
  const fetchProducts = async()=>{ const res = await fetch(`${API_URL}/products`); setProducts(await res.json()); }

  const addToCart = ()=>{
    if(!selectedProduct||quantity<=0) return;
    const product = products.find(p=>p.id===parseInt(selectedProduct));
    if(!product) return;
    const existing = cart.find(i=>i.id===product.id);
    if(existing) setCart(cart.map(i=>i.id===product.id?{...i,quantity:i.quantity+parseInt(quantity)}:i));
    else setCart([...cart,{...product,quantity:parseInt(quantity)}]);
    setSelectedProduct(""); setQuantity(1);
  }

  const removeFromCart = (id)=>setCart(cart.filter(i=>i.id!==id));

  const handleConfirmSale = async()=>{
    for(let item of cart){
      const res = await fetch(`${API_URL}/sales`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({productId:item.id,quantity:item.quantity})
      });
      const data = await res.json();
      if(data.error) alert(`Error selling ${item.name}: ${data.error}`);
    }
    alert("Sale completed!");
    setCart([]); fetchProducts();
  }

  return (
    <div>
      <h2>POS Sales Module</h2>
      <div>
        <select value={selectedProduct} onChange={e=>setSelectedProduct(e.target.value)}>
          <option value="">Select Product</option>
          {products.map(p=><option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
        </select>
        <input type="number" min="1" value={quantity} onChange={e=>setQuantity(e.target.value)} />
        <button onClick={addToCart}>Add to Cart</button>
      </div>

      <h3>Cart</h3>
      {cart.length===0?<p>No items</p>:(
        <table border="1" cellPadding="8">
          <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th>Action</th></tr></thead>
          <tbody>
            {cart.map(item=>(
              <tr key={item.id}>
                <td>{item.name}</td><td>{item.price.toFixed(2)}</td><td>{item.quantity}</td>
                <td>{(item.price*item.quantity).toFixed(2)}</td>
                <td><button onClick={()=>removeFromCart(item.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {cart.length>0 && <>
        <h4>Total: {cart.reduce((sum,i)=>sum+i.price*i.quantity,0).toFixed(2)}</h4>
        <button onClick={handleConfirmSale}>Confirm Sale</button>
      </>}
    </div>
  );
};

export default SalesModule;
