const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET all products
router.get('/', (req, res) => {
  res.json(store.products);
});

// GET single product
router.get('/:id', (req, res) => {
  const product = store.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST new product
router.post('/', (req, res) => {
  const { name, category, price, oldPrice, image, badge, rating, reviews, description, specs } = req.body;
  if (!name || !category || !price) return res.status(400).json({ error: 'Name, category, and price are required' });
  const product = {
    id: store.getNextProductId(), name, category,
    price: parseFloat(price), oldPrice: oldPrice ? parseFloat(oldPrice) : null,
    image: image || '/images/product-laptop.png', badge: badge || null,
    rating: parseFloat(rating) || 0, reviews: parseInt(reviews) || 0,
    description: description || '', specs: specs || []
  };
  store.products.push(product);
  res.status(201).json(product);
});

// PUT update product
router.put('/:id', (req, res) => {
  const idx = store.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const { name, category, price, oldPrice, image, badge, rating, reviews, description, specs } = req.body;
  store.products[idx] = {
    ...store.products[idx], name, category,
    price: parseFloat(price), oldPrice: oldPrice ? parseFloat(oldPrice) : null,
    image, badge: badge || null,
    rating: parseFloat(rating) || 0, reviews: parseInt(reviews) || 0,
    description: description || '', specs: specs || []
  };
  res.json(store.products[idx]);
});

// DELETE product
router.delete('/:id', (req, res) => {
  const idx = store.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  store.products.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router;
