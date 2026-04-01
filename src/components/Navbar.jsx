import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav id="mainNavbar" className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="brand-icon"><i className="bi bi-cpu-fill"></i></span> TechStore
        </Link>
        <button className="navbar-toggler" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`navbar-collapse${menuOpen ? ' open' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item"><Link className={isActive('/')} to="/"><i className="bi bi-house-fill me-1"></i>Home</Link></li>
            <li className="nav-item"><Link className={isActive('/products')} to="/products"><i className="bi bi-grid me-1"></i>Products</Link></li>
            <li className="nav-item"><a className="nav-link" href="/#features"><i className="bi bi-star me-1"></i>Features</a></li>
            <li className="nav-item"><a className="nav-link" href="/#contact"><i className="bi bi-envelope me-1"></i>Contact</a></li>
          </ul>
          <div className="navbar-actions">
            <div className="nav-user-area">
              {user ? (
                <div className="user-controls">
                  {isAdmin && (
                    <Link to="/admin" className="nav-link dashboard-link">
                      <i className="bi bi-speedometer2 me-1"></i>Dashboard
                    </Link>
                  )}
                  <div className="nav-user-avatar" title={user.name}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button className="btn-logout" onClick={logout}>
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-outline-custom login-btn">
                  <i className="bi bi-person me-1"></i>Login
                </Link>
              )}
            </div>
            <Link to="/cart" className="nav-cart-btn">
              <i className="bi bi-cart3"></i> Cart
              {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
