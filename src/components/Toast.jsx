import { useCart } from '../contexts/CartContext';

export default function Toast() {
  const { toasts } = useCart();
  if (!toasts.length) return null;
  return (
    <div id="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast-notification show">
          <i className="bi bi-check-circle-fill me-2"></i>{t.message}
        </div>
      ))}
    </div>
  );
}
