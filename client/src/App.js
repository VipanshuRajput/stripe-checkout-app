import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Success from "./pages/Success";
import Failure from "./pages/Failure";

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = product => {
    setCart([...cart, { ...product, qty: 1 }]);
  };

  return (
    <BrowserRouter>
      <Navbar count={cart.length} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
      </Routes>
    </BrowserRouter>
  );
}
