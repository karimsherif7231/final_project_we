import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const API = '/api';
const API_URL = ''; // Relative since proxied

export default function AdminPage() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [panel, setPanel] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null); // 'add' | 'edit' | null
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchProduct, setSearchProduct] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => { if (!isAdmin) navigate('/login'); }, [isAdmin]);

  const fetchAll = () => {
    fetch(`${API}/products`).then(r => r.json()).then(setProducts).catch(() => { });
    fetch(`${API}/users`).then(r => r.json()).then(setUsers).catch(() => { });
    fetch(`${API}/orders`).then(r => r.json()).then(setOrders).catch(() => { });
  };
  useEffect(fetchAll, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const revenue = orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0);

  // Products
  const filteredProducts = products.filter(p => {
    const matchQ = !searchProduct || p.name.toLowerCase().includes(searchProduct.toLowerCase());
    const matchCat = !catFilter || p.category === catFilter;
    return matchQ && matchCat;
  });

  const [form, setForm] = useState({ name: '', category: 'Laptops', badge: '', price: '', oldPrice: '', rating: '', reviews: '', image: '', description: '', specs: '' });

  const openAddModal = () => {
    setForm({ name: '', category: 'Laptops', badge: '', price: '', oldPrice: '', rating: '', reviews: '', image: '', description: '', specs: '' });
    setEditProduct(null);
    setModal('add');
  };
  const openEditModal = (p) => {
    setForm({ name: p.name, category: p.category, badge: p.badge || '', price: p.price, oldPrice: p.oldPrice || '', rating: p.rating || '', reviews: p.reviews || '', image: (p.image || '').replace('/images/', 'images/'), description: p.description || '', specs: (p.specs || []).join('\n') });
    setEditProduct(p);
    setModal('edit');
  };

  const saveProduct = async () => {
    if (!form.name || !form.category || !form.price) { showToast('Fill required fields', 'error'); return; }
    const body = { ...form, price: parseFloat(form.price), oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null, rating: parseFloat(form.rating) || 0, reviews: parseInt(form.reviews) || 0, image: form.image ? `/images/${form.image.replace('images/', '')}` : '/images/product-laptop.png', specs: form.specs ? form.specs.split('\n').map(s => s.trim()).filter(Boolean) : [] };
    if (editProduct) {
      await fetch(`${API}/products/${editProduct.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      showToast('Product updated!');
    } else {
      await fetch(`${API}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      showToast('Product added!');
    }
    setModal(null); fetchAll();
  };

  const deleteProduct = async (id) => {
    await fetch(`${API}/products/${id}`, { method: 'DELETE' });
    showToast('Product deleted.');
    setDeleteConfirm(null); fetchAll();
  };
  const deleteUser = async (id) => {
    await fetch(`${API}/users/${id}`, { method: 'DELETE' });
    showToast('User removed.');
    setDeleteConfirm(null); fetchAll();
  };
  const markShipped = async (id) => {
    await fetch(`${API}/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Shipped' }) });
    showToast('Order marked as Shipped!');
    fetchAll();
  };

  const filteredUsers = users.filter(u => !searchUser || u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()));

  const formatDate = (iso) => { if (!iso) return '—'; return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };

  const panels = { dashboard: 'Dashboard', products: 'Products', users: 'Users', orders: 'Orders' };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon"><i className="bi bi-cpu-fill"></i></div>
          <div><div className="logo-text">TechStore</div><div className="logo-sub">Admin Panel</div></div>
        </div>
        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Overview</p>
          <button className={`sidebar-link${panel === 'dashboard' ? ' active' : ''}`} onClick={() => { setPanel('dashboard'); setSidebarOpen(false) }}><i className="bi bi-grid-1x2-fill"></i> Dashboard</button>
          <p className="sidebar-section-label">Catalog</p>
          <button className={`sidebar-link${panel === 'products' ? ' active' : ''}`} onClick={() => { setPanel('products'); setSidebarOpen(false) }}><i className="bi bi-box-seam"></i> Products <span className="badge-count">{products.length}</span></button>
          <p className="sidebar-section-label">Customers</p>
          <button className={`sidebar-link${panel === 'users' ? ' active' : ''}`} onClick={() => { setPanel('users'); setSidebarOpen(false) }}><i className="bi bi-people-fill"></i> Users <span className="badge-count">{users.length}</span></button>
          <button className={`sidebar-link${panel === 'orders' ? ' active' : ''}`} onClick={() => { setPanel('orders'); setSidebarOpen(false) }}><i className="bi bi-receipt"></i> Orders <span className="badge-count">{orders.length}</span></button>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div><div className="admin-name">{user?.name}</div><div className="admin-role">Administrator</div></div>
          </div>
          <button className="btn-logout-side" onClick={logout}><i className="bi bi-box-arrow-right"></i> Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left-group">
            <button className="topbar-icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><i className="bi bi-list"></i></button>
            <div className="topbar-left"><h2>{panels[panel]}</h2><div className="breadcrumb-text">TechStore Admin / {panels[panel]}</div></div>
          </div>
          <div className="topbar-right">
            <Link to="/" className="store-link-btn"><i className="bi bi-shop"></i> View Store</Link>
          </div>
        </div>

        <div className="page-content">
          {/* DASHBOARD */}
          {panel === 'dashboard' && (
            <div>
              <div className="stat-grid">
                {[{ icon: 'bi-box-seam', bg: 'rgba(108,61,232,0.15)', color: 'var(--primary-light)', val: products.length, lbl: 'Total Products' },
                { icon: 'bi-people-fill', bg: 'rgba(0,212,255,0.12)', color: 'var(--accent)', val: users.length, lbl: 'Registered Users' },
                { icon: 'bi-receipt', bg: 'rgba(34,197,94,0.12)', color: 'var(--success)', val: orders.length, lbl: 'Total Orders' },
                { icon: 'bi-currency-dollar', bg: 'rgba(245,158,11,0.12)', color: 'var(--warning)', val: `$${revenue.toFixed(2)}`, lbl: 'Revenue' }
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <div className="stat-icon" style={{ background: s.bg, color: s.color }}><i className={`bi ${s.icon}`}></i></div>
                    <div className="stat-val">{s.val}</div><div className="stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
              <div className="dashboard-panels">
                <div className="section-card">
                  <div className="section-card-header"><h4><i className="bi bi-box-seam me-2"></i>Recent Products</h4></div>
                  <div className="section-card-body">
                    {products.slice(-5).reverse().map(p => (
                      <div key={p.id} className="recent-row">
                        <div className="recent-thumb"><img src={`${API_URL}${p.image}`} alt="" /></div>
                        <div className="recent-info"><div className="recent-name">{p.name}</div><div className="recent-sub">{p.category}</div></div>
                        <div className="recent-price">${parseFloat(p.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="section-card">
                  <div className="section-card-header"><h4><i className="bi bi-people me-2"></i>Recent Users</h4></div>
                  <div className="section-card-body">
                    {users.slice(-6).reverse().map(u => (
                      <div key={u.id} className="recent-row">
                        <div className="admin-avatar small">{u.name.charAt(0).toUpperCase()}</div>
                        <div className="recent-info"><div className="recent-name">{u.name}</div><div className="recent-sub">{u.email}</div></div>
                        <span className={`badge-pill ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {panel === 'products' && (
            <div className="section-card">
              <div className="section-card-header">
                <h4><i className="bi bi-box-seam me-2"></i>All Products</h4>
                <div className="filter-bar">
                  <div className="search-input-wrap"><i className="bi bi-search"></i><input placeholder="Search products..." value={searchProduct} onChange={e => setSearchProduct(e.target.value)} /></div>
                  <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="admin-select">
                    <option value="">All Categories</option>
                    {['Laptops', 'Smartphones', 'Audio', 'Wearables', 'Tablets', 'Accessories'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button className="btn-primary-sm" onClick={openAddModal}><i className="bi bi-plus-lg"></i> Add Product</button>
                </div>
              </div>
              <div className="table-wrap">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Rating</th><th>Badge</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id}>
                        <td className="td-muted">#{p.id}</td>
                        <td><div className="table-thumb"><img src={`${API_URL}${p.image}`} alt="" /></div></td>
                        <td className="td-name">{p.name}</td>
                        <td><span className="badge-pill badge-user">{p.category}</span></td>
                        <td className="td-bold">${parseFloat(p.price).toFixed(2)}</td>
                        <td>{'★'.repeat(Math.round(p.rating || 0))} <span className="td-muted">{p.rating || '—'}</span></td>
                        <td>{p.badge ? <span className="badge-pill badge-warn">{p.badge}</span> : '—'}</td>
                        <td><div className="action-btns"><button className="btn-outline-sm" onClick={() => openEditModal(p)}><i className="bi bi-pencil"></i></button><button className="btn-danger-sm" onClick={() => setDeleteConfirm({ type: 'product', id: p.id, name: p.name })}><i className="bi bi-trash3"></i></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && <div className="empty-state"><i className="bi bi-box-seam"></i><p>No products found.</p></div>}
              </div>
            </div>
          )}

          {/* USERS */}
          {panel === 'users' && (
            <div className="section-card">
              <div className="section-card-header">
                <h4><i className="bi bi-people-fill me-2"></i>Registered Users</h4>
                <div className="filter-bar"><div className="search-input-wrap"><i className="bi bi-search"></i><input placeholder="Search users..." value={searchUser} onChange={e => setSearchUser(e.target.value)} /></div></div>
              </div>
              <div className="table-wrap">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td className="td-muted">#{u.id}</td>
                        <td><div className="user-name-cell"><div className="admin-avatar small">{u.name.charAt(0).toUpperCase()}</div><span className="td-bold">{u.name}</span></div></td>
                        <td className="td-muted">{u.email}</td>
                        <td><span className={`badge-pill ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{u.role}</span></td>
                        <td className="td-muted">{formatDate(u.joined)}</td>
                        <td>{u.role !== 'admin' ? <button className="btn-danger-sm" onClick={() => setDeleteConfirm({ type: 'user', id: u.id, name: u.name })}><i className="bi bi-person-x"></i> Remove</button> : <span className="td-muted"><i className="bi bi-shield-check me-1"></i>Protected</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {panel === 'orders' && (
            <div className="section-card">
              <div className="section-card-header"><h4><i className="bi bi-receipt me-2"></i>Orders</h4></div>
              <div className="table-wrap">
                {orders.length > 0 ? (
                  <table className="admin-table">
                    <thead><tr><th>Order #</th><th>Customer</th><th>Email</th><th>Total</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td className="td-bold">#{o.id}</td>
                          <td className="td-bold">{o.name || 'Guest'}</td>
                          <td className="td-muted">{o.email || '—'}</td>
                          <td className="td-price">${parseFloat(o.total || 0).toFixed(2)}</td>
                          <td className="td-muted">{formatDate(o.date)}</td>
                          <td><span className="badge-pill badge-warn">{o.status || 'Processing'}</span></td>
                          <td><button className="btn-outline-sm" onClick={() => markShipped(o.id)}><i className="bi bi-check2-circle"></i> Mark Shipped</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <div className="empty-state"><i className="bi bi-receipt"></i><p>No orders yet.</p></div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {modal && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="modal-box">
            <div className="modal-title"><i className={`bi ${editProduct ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>{editProduct ? 'Edit Product' : 'Add New Product'}</div>
            <div className="modal-form-grid">
              <div className="form-field full"><label>Product Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. UltraBook Pro 15" /></div>
              <div className="form-field"><label>Category *</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{['Laptops', 'Smartphones', 'Audio', 'Wearables', 'Tablets', 'Accessories'].map(c => <option key={c}>{c}</option>)}</select></div>
              <div className="form-field"><label>Badge</label><input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="e.g. New, Sale" /></div>
              <div className="form-field"><label>Price ($) *</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} min="0" step="0.01" /></div>
              <div className="form-field"><label>Old Price ($)</label><input type="number" value={form.oldPrice} onChange={e => setForm({ ...form, oldPrice: e.target.value })} min="0" step="0.01" /></div>
              <div className="form-field"><label>Rating (0–5)</label><input type="number" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} min="0" max="5" step="0.1" /></div>
              <div className="form-field"><label>Reviews</label><input type="number" value={form.reviews} onChange={e => setForm({ ...form, reviews: e.target.value })} min="0" /></div>
              <div className="form-field full"><label>Image filename</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="product-laptop.png" /></div>
              <div className="form-field full"><label>Description *</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." /></div>
              <div className="form-field full"><label>Specs (one per line)</label><textarea value={form.specs} onChange={e => setForm({ ...form, specs: e.target.value })} placeholder={'15.6" 4K Display\nIntel Core i9\n32GB RAM'} style={{ minHeight: '90px' }} /></div>
            </div>
            <div className="modal-actions"><button className="btn-outline-sm" onClick={() => setModal(null)}><i className="bi bi-x"></i> Cancel</button><button className="btn-primary-sm" onClick={saveProduct}><i className="bi bi-check-lg"></i> Save</button></div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null) }}>
          <div className="modal-box delete-modal">
            <div className="delete-icon"><i className="bi bi-exclamation-triangle-fill"></i></div>
            <div className="modal-title center">{deleteConfirm.type === 'product' ? `Delete "${deleteConfirm.name}"?` : `Remove user "${deleteConfirm.name}"?`}</div>
            <p className="delete-msg">This action cannot be undone.</p>
            <div className="delete-actions">
              <button className="btn-outline-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-danger-sm" onClick={() => deleteConfirm.type === 'product' ? deleteProduct(deleteConfirm.id) : deleteUser(deleteConfirm.id)}><i className="bi bi-trash3"></i> Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div id="adminToast">
          <div className={`admin-toast-item show${toast.type === 'error' ? ' error' : ''}`}>
            <i className={`bi ${toast.type === 'error' ? 'bi-x-circle-fill' : 'bi-check-circle-fill'}`}></i> {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
