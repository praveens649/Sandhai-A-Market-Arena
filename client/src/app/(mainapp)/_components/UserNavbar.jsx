import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Heart, User, Store } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const UserNavbar = () => {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <Store size={27} />
        <span>Sandhai</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/orders">My Orders</NavLink>
      </nav>

      <div className="nav-actions">
        <ThemeToggle />

        <Link to="/wishlist" className="nav-icon" title="Wishlist">
          <Heart />
        </Link>

        <Link to="/cart" className="nav-icon" title="Cart">
          <ShoppingCart />
        </Link>

        <Link to="/profile" className="nav-icon" title="Profile">
          <User />
        </Link>
      </div>
    </header>
  );
};

export default UserNavbar;