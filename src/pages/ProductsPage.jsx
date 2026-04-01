import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5000/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetch(`${API}/products`).then(r => r.json()).then(setProducts).catch(() => {});
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setCategory(cat);
  }, [searchParams]);

  let filtered = category === 'All' ? [...products] : products.filter(p => p.category === category);
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  const categories = ['All', 'Laptops', 'Smartphones', 'Audio', 'Wearables', 'Tablets', 'Accessories'];
  const catIcons = { Laptops: 'bi-laptop', Smartphones: 'bi-phone', Audio: 'bi-headphones', Wearables: 'bi-watch', Tablets: 'bi-tablet', Accessories: 'bi-plug' };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="section-eyebrow">Our Collection</span>
          <h1 className="section-title mt-2">All Products</h1>
          <div className="breadcrumb-nav">
            <a href="/">Home</a><i className="bi bi-chevron-right"></i><span>Products</span>
          </div>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="products-toolbar">
            <div className="categories-bar compact">
              {categories.map(c => (
                <button key={c} className={`cat-btn${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>
                  {catIcons[c] && <i className={`bi ${catIcons[c]} me-1`}></i>}{c === 'All' ? 'All' : c}
                </button>
              ))}
            </div>
            <div className="sort-control">
              <label>Sort by:</label>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <p className="result-count">
            {filtered.length > 0 && `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
          </p>

          {filtered.length > 0 ? (
            <div className="products-grid">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-search"></i>
              <p>No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
