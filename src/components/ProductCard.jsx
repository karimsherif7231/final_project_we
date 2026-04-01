import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const API_URL = 'http://localhost:5000';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    else if (rating >= i - 0.5) stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
    else stars.push(<i key={i} className="bi bi-star text-warning"></i>);
  }
  return <>{stars}</>;
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;
  const imgSrc = product.image?.startsWith('http') ? product.image : `${API_URL}${product.image}`;

  return (
    <div className="product-card-col">
      <div className="product-card" onClick={() => window.location.href = `/products/${product.id}`}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {discount && <span className="discount-tag">-{discount}%</span>}
        <div className="product-img-wrap">
          <img src={imgSrc} alt={product.name} loading="lazy" />
        </div>
        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <StarRating rating={product.rating} />
            <span className="review-count">({product.reviews})</span>
          </div>
          <div className="product-price-row">
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.oldPrice && <span className="old-price">${product.oldPrice.toFixed(2)}</span>}
          </div>
          <button className="btn-add-cart" onClick={(e) => { e.stopPropagation(); addItem(product); }}>
            <i className="bi bi-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export { StarRating };
