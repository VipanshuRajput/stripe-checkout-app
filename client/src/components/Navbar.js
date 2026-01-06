import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ count }) {
  return (
    <nav className="nav">
      <h2>🛍 StripeShop</h2>
      <Link to="/cart" className="cart-btn">
        🛒 Cart ({count})
      </Link>
    </nav>
  );
}
