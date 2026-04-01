import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const API_URL = 'http://localhost:5000';

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart, totalCount, totalPrice } = useCart();
  const tax = totalPrice * 0.08;
  const shipping = totalPrice >= 50 ? 0 : 9.99;
  const grandTotal = totalPrice + tax + shipping;

  if (cart.length === 0) {
    return (
      <>
        <div className="page-header">
          <div className="container">
            <span className="section-eyebrow"><i className="bi bi-cart3 me-1"></i>My Cart</span>
            <h1 className="section-title mt-2">Shopping Cart</h1>
          </div>
        </div>
        <div className="empty-cart">
          <i className="bi bi-cart-x"></i>
          <h3>Your Cart is Empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn-primary-custom" style={{marginTop:'24px',display:'inline-flex'}}>
            <i className="bi bi-grid-3x3-gap-fill"></i> Start Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="section-eyebrow"><i className="bi bi-cart3 me-1"></i>My Cart</span>
          <h1 className="section-title mt-2">Shopping Cart</h1>
          <div className="breadcrumb-nav"><Link to="/">Home</Link><i className="bi bi-chevron-right"></i><span>Cart</span></div>
        </div>
      </div>

      <section style={{padding:'60px 0'}}>
        <div className="container">
          <div className="cart-layout">
            <div className="cart-items-col">
              <div className="cart-items-header">
                <h5>{totalCount} Item{totalCount !== 1 ? 's' : ''}</h5>
                <button className="btn-remove" onClick={() => { if (confirm('Remove all items from cart?')) clearCart(); }}>
                  <i className="bi bi-trash3 me-1"></i>Clear All
                </button>
              </div>
              {cart.map(item => {
                const imgSrc = item.image?.startsWith('http') ? item.image : `${API_URL}${item.image}`;
                return (
                  <div className="cart-item-row" key={item.id}>
                    <div className="cart-item-img"><img src={imgSrc} alt={item.name} /></div>
                    <div className="cart-item-details">
                      <p className="cart-item-cat">{item.category}</p>
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}><i className="bi bi-dash"></i></button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}><i className="bi bi-plus"></i></button>
                      </div>
                      <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                      <button className="btn-remove" onClick={() => removeItem(item.id)}><i className="bi bi-trash3"></i></button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-summary-col">
              <div className="cart-summary-card">
                <h5><i className="bi bi-receipt me-2"></i>Order Summary</h5>
                <div className="summary-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
                <div className="summary-row"><span>Shipping</span><span style={{color:'var(--success)'}}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="summary-row total"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
                <Link to="/checkout" className="btn-primary-custom w-full justify-center mt-3">
                  <i className="bi bi-lock-fill"></i> Secure Checkout
                </Link>
                <Link to="/products" className="btn-outline-custom w-full justify-center mt-2">
                  <i className="bi bi-arrow-left"></i> Continue Shopping
                </Link>
                <div className="security-badges">
                  <i className="bi bi-shield-lock me-1 text-success"></i> SSL Secured &nbsp;
                  <i className="bi bi-credit-card me-1"></i> Safe Payments
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
