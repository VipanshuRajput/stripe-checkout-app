import axios from "axios";
import "./Cart.css";
import { useState } from "react";

export default function Cart({ cart }) {
  const [email, setEmail] = useState("");

  const checkout = async () => {
    const res = await axios.post("http://127.0.0.1:5000/create-checkout-session", {
      email,
      items: cart
    });
    window.location = res.data.url;
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cart.map((item, i) => (
        <div key={i} className="row">
          {item.name} — ₹{item.price} x {item.qty}
        </div>
      ))}

      <input
        placeholder="Enter email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={checkout}>Proceed to Checkout</button>
    </div>
  );
}
