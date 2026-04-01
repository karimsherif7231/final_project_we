import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';

const API = 'http://localhost:5000/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const { showToast } = useCart();

  useEffect(() => {
    fetch(`${API}/products`).then(r => r.json()).then(setProducts).catch(() => {});
  }, []);

  const filtered = category === 'All' ? products : products.filter(p => p.category === category);

  const categories = [
    { name: 'All', label: 'All Products', icon: '' },
    { name: 'Laptops', label: 'Laptops', icon: 'bi-laptop' },
    { name: 'Smartphones', label: 'Phones', icon: 'bi-phone' },
    { name: 'Audio', label: 'Audio', icon: 'bi-headphones' },
    { name: 'Wearables', label: 'Wearables', icon: 'bi-watch' },
    { name: 'Tablets', label: 'Tablets', icon: 'bi-tablet' },
    { name: 'Accessories', label: 'Accessories', icon: 'bi-plug' },
  ];

  const handleNewsletter = (e) => {
    e.preventDefault();
    showToast('🎉 Subscribed! Welcome to TechStore.');
    e.target.reset();
  };

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-row">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <i className="bi bi-lightning-charge-fill"></i> New Arrivals 2025
              </div>
              <h1 className="hero-title">
                The Future of<br />
                <span className="gradient-text">Technology</span><br />
                Is Here
              </h1>
              <p className="hero-subtitle">
                Discover cutting-edge electronics, from ultra-slim laptops to pro-grade audio gear.
                Premium quality, unbeatable prices, delivered to your door.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn-primary-custom">
                  <i className="bi bi-grid-1x2-fill"></i> Shop Now
                </Link>
                <a href="#featured" className="btn-outline-custom">
                  <i className="bi bi-play-circle"></i> See Featured
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-item"><div className="stat-value">500+</div><div className="stat-label">Products</div></div>
                <div className="stat-item"><div className="stat-value">50K+</div><div className="stat-label">Happy Customers</div></div>
                <div className="stat-item"><div className="stat-value">4.9★</div><div className="stat-label">Avg Rating</div></div>
                <div className="stat-item"><div className="stat-value">24/7</div><div className="stat-label">Support</div></div>
              </div>
            </div>
            <div className="hero-image-wrap">
              <div className="hero-img-card">
                <img src="http://localhost:5000/images/hero-banner.png" alt="TechStore Premium Electronics" />
              </div>
              <div className="hero-badge-floating">
                <div className="badge-icon"><i className="bi bi-shield-check"></i></div>
                <div>
                  <div style={{fontWeight:700,fontSize:'0.85rem'}}>2-Year Warranty</div>
                  <div style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>On all products</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="categories-section">
        <div className="container">
          <div className="categories-bar">
            {categories.map(c => (
              <button key={c.name} className={`cat-btn${category === c.name ? ' active' : ''}`}
                onClick={() => setCategory(c.name)}>
                {c.icon && <i className={`bi ${c.icon} me-1`}></i>}{c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="featured">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">🔥 Hot Picks</span>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Hand-picked selection of our top-rated tech essentials</p>
          </div>
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="section-cta">
            <Link to="/products" className="btn-primary-custom">
              <i className="bi bi-grid-3x3-gap-fill"></i> View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Why TechStore</span>
            <h2 className="section-title">Shop With Confidence</h2>
          </div>
          <div className="features-grid">
            {[
              { icon: 'bi-truck', title: 'Free Shipping', desc: 'Free delivery on all orders over $50. Same-day dispatch for orders before 2PM.' },
              { icon: 'bi-shield-check', title: '2-Year Warranty', desc: "All products come with a comprehensive 2-year manufacturer's warranty." },
              { icon: 'bi-arrow-counterclockwise', title: '30-Day Returns', desc: 'Not happy? Return any product within 30 days for a full, hassle-free refund.' },
              { icon: 'bi-headset', title: '24/7 Support', desc: 'Our expert team is available around the clock to assist you with anything.' },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon"><i className={`bi ${f.icon}`}></i></div>
                <h5>{f.title}</h5>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section" id="contact">
        <div className="container section-header">
          <span className="section-eyebrow">Stay Updated</span>
          <h2 className="section-title mt-2 mb-2">Get Exclusive Deals</h2>
          <p className="section-subtitle mb-4">Subscribe and be the first to know about new arrivals, flash sales, and tech tips.</p>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input type="email" placeholder="Enter your email address..." required />
            <button type="submit" className="btn-primary-custom">
              <i className="bi bi-send-fill"></i> Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
