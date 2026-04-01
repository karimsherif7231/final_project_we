import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      id="scrollTopBtn"
      className={visible ? 'visible' : ''}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
    >
      <i className="bi bi-arrow-up"></i>
    </button>
  );
}
