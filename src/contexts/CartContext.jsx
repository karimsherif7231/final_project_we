import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('techstore_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const addItem = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, {
        id: product.id, name: product.name, price: product.price,
        image: product.image, category: product.category, quantity
      }];
    });
    showToast(`"${product.name}" added to cart!`);
  };

  const removeItem = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeItem(productId); return; }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, totalCount, totalPrice, toasts, showToast }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
