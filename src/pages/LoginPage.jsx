import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  if (user) { navigate(user.role === 'admin' ? '/admin' : '/'); return null; }

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) setError(result.msg);
    else navigate(result.user.role === 'admin' ? '/admin' : '/');
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError('');
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (!result.ok) setError(result.msg);
    else navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="bi bi-cpu-fill brand-icon"></i>
          <span className="brand">TechStore</span>
          <p className="auth-sub">Premium Electronics Store</p>
        </div>

        <div className="tab-switcher">
          <button className={`tab-btn${tab==='login'?' active':''}`} onClick={()=>{setTab('login');setError('');}}>
            <i className="bi bi-box-arrow-in-right me-1"></i> Login
          </button>
          <button className={`tab-btn${tab==='register'?' active':''}`} onClick={()=>{setTab('register');setError('');}}>
            <i className="bi bi-person-plus me-1"></i> Register
          </button>
        </div>

        <div className="admin-hint">
          <i className="bi bi-shield-lock-fill me-1"></i>
          Admin: <strong>admin@techstore.com</strong> / <strong>admin123</strong>
        </div>

        {error && <div className="error-msg show"><i className="bi bi-exclamation-circle-fill"></i> {error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="input-group-custom"><i className="bi bi-envelope icon"></i><input type="email" name="email" placeholder="Email address" required /></div>
            <div className="input-group-custom"><i className="bi bi-lock icon"></i><input type="password" name="password" placeholder="Password" required /></div>
            <div className="remember-row"><label><input type="checkbox" /> Remember me</label><a href="#">Forgot password?</a></div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <><span className="spinner"></span> Please wait...</> : <><i className="bi bi-box-arrow-in-right me-1"></i> Login</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="input-group-custom"><i className="bi bi-person icon"></i><input type="text" name="name" placeholder="Full name" required /></div>
            <div className="input-group-custom"><i className="bi bi-envelope icon"></i><input type="email" name="email" placeholder="Email address" required /></div>
            <div className="input-group-custom"><i className="bi bi-lock icon"></i><input type="password" name="password" placeholder="Password (min 6 chars)" required minLength="6" /></div>
            <div className="input-group-custom"><i className="bi bi-lock-fill icon"></i><input type="password" name="confirm" placeholder="Confirm password" required /></div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <><span className="spinner"></span> Please wait...</> : <><i className="bi bi-person-check me-1"></i> Create Account</>}
            </button>
          </form>
        )}

        <div className="divider-text">or</div>
        <Link to="/" className="guest-link"><i className="bi bi-arrow-left me-1"></i>Continue as guest</Link>
      </div>
    </div>
  );
}
