import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <div className="footer-brand"><i className="bi bi-cpu-fill me-2"></i>TechStore</div>
            <p className="footer-desc">Your ultimate destination for premium electronics and gadgets. Curated for tech enthusiasts who demand the best.</p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
              <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
              <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="#" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <p className="footer-heading">Shop</p>
            <ul className="footer-links">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?cat=Laptops">Laptops</Link></li>
              <li><Link to="/products?cat=Smartphones">Smartphones</Link></li>
              <li><Link to="/products?cat=Audio">Audio</Link></li>
              <li><Link to="/products?cat=Wearables">Wearables</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-heading">Support</p>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Returns & Refunds</a></li>
              <li><a href="#">Warranty Info</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-heading">Company</p>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 TechStore. All rights reserved. Built with ❤️ using React & Node.js.</p>
          <div className="footer-payment">
            <i className="bi bi-credit-card-fill" title="Credit Card"></i>
            <i className="bi bi-paypal" title="PayPal"></i>
            <i className="bi bi-wallet2" title="Digital Wallet"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}
