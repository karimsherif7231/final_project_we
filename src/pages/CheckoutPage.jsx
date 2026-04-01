import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const API = 'http://localhost:5000/api';
const API_URL = 'http://localhost:5000';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart, showToast } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shippingCost, setShippingCost] = useState(0);
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', address:'', city:'', state:'', zip:'', country:'US', cardName:'', cardNumber:'', expiry:'', cvv:'' });
  const [orderResult, setOrderResult] = useState(null);

  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + tax + shippingCost;

  if (cart.length === 0 && !orderResult) {
    return (
      <>
        <div className="page-header"><div className="container">
          <span className="section-eyebrow"><i className="bi bi-lock-fill me-1"></i>Secure Checkout</span>
          <h1 className="section-title mt-2">Checkout</h1>
        </div></div>
        <div className="empty-state" style={{padding:'80px 20px'}}>
          <i className="bi bi-cart-x" style={{fontSize:'3rem'}}></i>
          <h3 style={{marginTop:'16px'}}>Nothing to Checkout</h3>
          <p>Your cart is empty. Add some products first!</p>
          <Link to="/products" className="btn-primary-custom" style={{marginTop:'16px',display:'inline-flex'}}>Start Shopping</Link>
        </div>
      </>
    );
  }

  const updateForm = (field, value) => setForm(prev => ({...prev, [field]: value}));

  const formatCard = (val) => val.replace(/\D/g,'').substring(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = (val) => { let v = val.replace(/\D/g,'').substring(0,4); if(v.length>=2) v=v.substring(0,2)+' / '+v.substring(2); return v; };

  const goStep = (s) => {
    if (s === 2 && (!form.firstName || !form.email)) { showToast('⚠️ Please fill in required fields.'); return; }
    if (s === 3 && (!form.address || !form.city || !form.zip)) { showToast('⚠️ Please fill in required address fields.'); return; }
    setStep(s);
    window.scrollTo({top:0,behavior:'smooth'});
  };

  const placeOrder = async () => {
    if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvv) { showToast('⚠️ Please fill in all payment fields.'); return; }
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name: form.firstName, email: form.email, address: form.address, total: grandTotal, items: cart, shipping: shippingCost })
      });
      const order = await res.json();
      const days = shippingCost >= 29.99 ? 1 : shippingCost >= 14.99 ? 3 : 7;
      const delivery = new Date(Date.now() + days * 86400000);
      setOrderResult({ ...order, deliveryDate: delivery.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}), grandTotal });
      clearCart();
      setStep(4);
    } catch { showToast('Error placing order'); }
  };

  const stepClass = (s) => `step${s < step ? ' done active' : s === step ? ' active' : ''}`;

  return (
    <>
      <div className="page-header"><div className="container">
        <span className="section-eyebrow"><i className="bi bi-lock-fill me-1"></i>Secure Checkout</span>
        <h1 className="section-title mt-2">Checkout</h1>
        <div className="breadcrumb-nav"><Link to="/">Home</Link><i className="bi bi-chevron-right"></i><Link to="/cart">Cart</Link><i className="bi bi-chevron-right"></i><span>Checkout</span></div>
      </div></div>

      <section style={{padding:'60px 0'}}>
        <div className="container">
          <div className="step-indicator">
            <div className={stepClass(1)}><div className="step-dot">1</div><span className="step-label">Details</span></div>
            <div className={stepClass(2)}><div className="step-dot">2</div><span className="step-label">Shipping</span></div>
            <div className={stepClass(3)}><div className="step-dot">3</div><span className="step-label">Payment</span></div>
            <div className={stepClass(4)}><div className="step-dot"><i className="bi bi-check"></i></div><span className="step-label">Done</span></div>
          </div>

          <div className="checkout-layout">
            <div className="checkout-form-col">
              {step === 1 && (
                <div className="checkout-form-card">
                  <h5><i className="bi bi-person-fill me-2 text-primary"></i>Personal Information</h5>
                  <div className="form-grid">
                    <div className="form-field"><label>First Name *</label><input value={form.firstName} onChange={e=>updateForm('firstName',e.target.value)} placeholder="John" /></div>
                    <div className="form-field"><label>Last Name *</label><input value={form.lastName} onChange={e=>updateForm('lastName',e.target.value)} placeholder="Doe" /></div>
                    <div className="form-field"><label>Email Address *</label><input type="email" value={form.email} onChange={e=>updateForm('email',e.target.value)} placeholder="john@example.com" /></div>
                    <div className="form-field"><label>Phone Number</label><input type="tel" value={form.phone} onChange={e=>updateForm('phone',e.target.value)} placeholder="+1 234 567 890" /></div>
                  </div>
                  <div className="form-actions end"><button className="btn-primary-custom" onClick={()=>goStep(2)}>Next: Shipping <i className="bi bi-arrow-right ms-2"></i></button></div>
                </div>
              )}

              {step === 2 && (
                <div className="checkout-form-card">
                  <h5><i className="bi bi-truck me-2 text-primary"></i>Shipping Address</h5>
                  <div className="form-grid">
                    <div className="form-field full"><label>Street Address *</label><input value={form.address} onChange={e=>updateForm('address',e.target.value)} placeholder="123 Main Street, Apt 4B" /></div>
                    <div className="form-field"><label>City *</label><input value={form.city} onChange={e=>updateForm('city',e.target.value)} placeholder="New York" /></div>
                    <div className="form-field half"><label>State</label><input value={form.state} onChange={e=>updateForm('state',e.target.value)} placeholder="NY" /></div>
                    <div className="form-field half"><label>ZIP Code *</label><input value={form.zip} onChange={e=>updateForm('zip',e.target.value)} placeholder="10001" /></div>
                    <div className="form-field full"><label>Country *</label>
                      <select value={form.country} onChange={e=>updateForm('country',e.target.value)}>
                        <option value="US">United States</option><option value="CA">Canada</option><option value="GB">United Kingdom</option>
                        <option value="EG">Egypt</option><option value="SA">Saudi Arabia</option><option value="AE">United Arab Emirates</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="form-field full"><label>Shipping Method *</label>
                      <div className="shipping-options">
                        {[{val:0,label:'Standard Shipping',sub:'5–7 business days',price:'Free'},{val:14.99,label:'Express Shipping',sub:'2–3 business days',price:'$14.99'},{val:29.99,label:'Overnight Shipping',sub:'Next business day',price:'$29.99'}].map(opt=>(
                          <label key={opt.val} className={`shipping-option${shippingCost===opt.val?' selected':''}`}>
                            <input type="radio" name="shipping" checked={shippingCost===opt.val} onChange={()=>setShippingCost(opt.val)} />
                            <div><div className="ship-label">{opt.label}</div><div className="ship-sub">{opt.sub}</div></div>
                            <span className={`ship-price${opt.val===0?' free':''}`}>{opt.price}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="form-actions between">
                    <button className="btn-outline-custom" onClick={()=>goStep(1)}><i className="bi bi-arrow-left me-2"></i> Back</button>
                    <button className="btn-primary-custom" onClick={()=>goStep(3)}>Next: Payment <i className="bi bi-arrow-right ms-2"></i></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="checkout-form-card">
                  <h5><i className="bi bi-credit-card-fill me-2 text-primary"></i>Payment Details</h5>
                  <div className="form-grid">
                    <div className="form-field full"><label>Cardholder Name *</label><input value={form.cardName} onChange={e=>updateForm('cardName',e.target.value)} placeholder="John Doe" /></div>
                    <div className="form-field full"><label>Card Number *</label><input value={form.cardNumber} onChange={e=>updateForm('cardNumber',formatCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength="19" /></div>
                    <div className="form-field"><label>Expiry Date *</label><input value={form.expiry} onChange={e=>updateForm('expiry',formatExpiry(e.target.value))} placeholder="MM / YY" maxLength="7" /></div>
                    <div className="form-field"><label>CVV *</label><input value={form.cvv} onChange={e=>updateForm('cvv',e.target.value.replace(/\D/g,'').substring(0,4))} placeholder="•••" maxLength="4" /></div>
                  </div>
                  <div className="form-actions between">
                    <button className="btn-outline-custom" onClick={()=>goStep(2)}><i className="bi bi-arrow-left me-2"></i> Back</button>
                    <button className="btn-primary-custom" onClick={placeOrder}><i className="bi bi-bag-check-fill me-2"></i> Place Order</button>
                  </div>
                  <p className="payment-note"><i className="bi bi-lock-fill me-1"></i> Your payment info is encrypted and secure. This is a demo — no real charges.</p>
                </div>
              )}

              {step === 4 && orderResult && (
                <div className="checkout-form-card success-card">
                  <div className="success-icon"><i className="bi bi-check-lg"></i></div>
                  <h2>Order Placed Successfully!</h2>
                  <p className="success-subtitle">Thank you, <strong>{form.firstName || 'there'}</strong>! 🎉</p>
                  <p className="success-email">A confirmation email will be sent to <strong>{form.email}</strong></p>
                  <div className="success-details">
                    <div className="summary-row"><span>Order Number</span><span style={{fontWeight:700}}>#{orderResult.id}</span></div>
                    <div className="summary-row"><span>Estimated Delivery</span><span style={{color:'var(--success)',fontWeight:600}}>{orderResult.deliveryDate}</span></div>
                    <div className="summary-row total"><span>Amount Paid</span><span>${orderResult.grandTotal.toFixed(2)}</span></div>
                  </div>
                  <Link to="/products" className="btn-primary-custom" style={{display:'inline-flex'}}>
                    <i className="bi bi-grid-3x3-gap-fill me-2"></i> Continue Shopping
                  </Link>
                </div>
              )}
            </div>

            {step < 4 && (
              <div className="checkout-summary-col">
                <div className="cart-summary-card">
                  <h5><i className="bi bi-receipt me-2"></i>Order Summary</h5>
                  <div className="summary-items">
                    {cart.map(item => {
                      const imgSrc = item.image?.startsWith('http') ? item.image : `${API_URL}${item.image}`;
                      return (
                        <div key={item.id} className="summary-item">
                          <div className="summary-item-img"><img src={imgSrc} alt={item.name} /></div>
                          <div className="summary-item-info"><div className="summary-item-name">{item.name}</div><div className="summary-item-qty">Qty: {item.quantity}</div></div>
                          <span className="summary-item-price">${(item.price*item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="summary-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
                  <div className="summary-row"><span>Shipping</span><span style={{color:'var(--success)'}}>{shippingCost===0?'Free':`$${shippingCost.toFixed(2)}`}</span></div>
                  <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                  <div className="summary-row total"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
