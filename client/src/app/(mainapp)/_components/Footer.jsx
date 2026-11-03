import { Link } from "react-router-dom";
import { Store, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h2><Store size={23} /> Sandhai</h2>
          <p>Your everyday grocery shopping destination.</p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/profile">My Profile</Link>
        </div>

        <div>
          <h3>Contact Us</h3>
          <p><Mail size={16} /> support@sandhai.com</p>
          <p><Phone size={16} /> +91 98765 43210</p>
          <p><MapPin size={16} /> Chennai, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Sandhai. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;