import "./Home.css";

const products = [
  { id: 1, name: "Headphones", price: 1500 },
  { id: 2, name: "Keyboard", price: 2500 },
  { id: 3, name: "Mouse", price: 800 }
];

export default function Home({ addToCart }) {
  return (
    <div className="container">
      {products.map(p => (
        <div className="card" key={p.id}>
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <button onClick={() => addToCart(p)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
