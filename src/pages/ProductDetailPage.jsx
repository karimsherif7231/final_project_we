import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import ProductCard, { StarRating } from '../components/ProductCard';

const API = 'http://localhost:5000/api';
const API_URL = 'http://localhost:5000';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem, showToast } = useCart();

  useEffect(() => {
    setLoading(true);
    setQty(1);
    setWishlisted(false);
    Promise.all([
      fetch(`${API}/products/${id}`).then(r => r.ok ? r.json() : null),
      fetch(`${API}/products`).then(r => r.json())
    ]).then(([p, all]) => {
      setProduct(p);
      setAllProducts(all);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <section style={{padding:'60px 0'}}><div className="container" style={{textAlign:'center'}}><div className="spinner"></div></div></section>;
  if (!product) return (
    <section style={{padding:'60px 0'}}><div className="container" style={{textAlign:'center'}}>
      <i className="bi bi-exclamation-circle" style={{fontSize:'3rem',color:'var(--text-muted)'}}></i>
      <h3 style={{marginTop:'16px'}}>Product Not Found</h3>
      <Link to="/products" className="btn-primary-custom" style={{marginTop:'24px',display:'inline-flex'}}>Browse Products</Link>
    </div></section>
  );

  const imgSrc = product.image?.startsWith('http') ? product.image : `${API_URL}${product.image}`;
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <section style={{padding:'60px 0'}}>
      <div className="container">
        <div className="breadcrumb-nav" style={{justifyContent:'flex-start',marginBottom:'24px'}}>
          <Link to="/">Home</Link><i className="bi bi-chevron-right"></i>
          <Link to="/products">Products</Link><i className="bi bi-chevron-right"></i>
          <span>{product.name}</span>
        </div>

        <div className="detail-grid">
          <div className="detail-image-col">
            <div className="detail-img-wrap">
              <img src={imgSrc} alt={product.name} />
            </div>
          </div>
          <div className="detail-info-col">
            <p className="detail-category">{product.category}</p>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-rating-row">
              <StarRating rating={product.rating} />
              <span className="review-count-detail">{product.reviews} reviews</span>
              {product.badge && <span className="product-badge static">{product.badge}</span>}
            </div>
            <div className="detail-price-row">
              <span className="detail-price">${product.price.toFixed(2)}</span>
              {product.oldPrice && <span className="detail-old-price">${product.oldPrice.toFixed(2)}</span>}
              {discount && <span className="discount-tag static">-{discount}%</span>}
            </div>
            <p className="detail-desc">{product.description}</p>

            <div className="specs-card">
              <p className="specs-title">Key Specifications</p>
              <ul className="spec-list">
                {product.specs?.map((s, i) => (
                  <li key={i}><i className="bi bi-check-circle-fill"></i> {s}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><i className="bi bi-dash"></i></button>
                <span className="qty-val">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}><i className="bi bi-plus"></i></button>
              </div>
              <button className="btn-primary-custom detail-add-btn" onClick={() => addItem(product, qty)}>
                <i className="bi bi-cart-plus"></i> Add to Cart
              </button>
              <button className={`btn-outline-custom wishlist-btn${wishlisted ? ' active' : ''}`}
                onClick={() => {
                  setWishlisted(!wishlisted);
                  showToast(wishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist!');
                }}>
                <i className={`bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
              </button>
            </div>

            <div className="detail-perks">
              <span><i className="bi bi-truck me-1 text-success"></i> Free Shipping</span>
              <span><i className="bi bi-shield-check me-1 text-primary"></i> 2-Year Warranty</span>
              <span><i className="bi bi-arrow-counterclockwise me-1 text-warning"></i> 30-Day Returns</span>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="related-section">
            <h3 className="section-title" style={{fontSize:'1.5rem'}}>You May Also Like</h3>
            <div className="products-grid">{related.map(p => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        )}
      </div>
    </section>
  );
}
