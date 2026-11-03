import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="hero-banner">
      <div className="hero-text">
        <span className="hero-label">FRESHNESS DELIVERED</span>

        <h1>Fresh Choices.<br />Better Living.</h1>

        <p>
          Shop fresh fruits, vegetables, dairy products and
          everyday grocery essentials at Sandhai.
        </p>

        <Link to="/products" className="primary-btn">
          Shop Now <ArrowRight size={18} />
        </Link>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
          alt="Fresh grocery collection"
        />
      </div>
    </section>
  );
};

export default HeroBanner;