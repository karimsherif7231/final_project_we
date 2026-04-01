const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET all orders
router.get('/', (req, res) => {
  res.json(store.orders);
});

// POST place order
router.post('/', (req, res) => {
  const { name, email, address, total, items, shipping } = req.body;
  const order = {
    id: 'TS' + Math.floor(10000 + Math.random() * 90000),
    name: name || 'Guest', email: email || '', address: address || '',
    total: parseFloat(total) || 0, items: items || [],
    shipping: parseFloat(shipping) || 0,
    date: new Date().toISOString(), status: 'Processing'
  };
  store.orders.unshift(order);
  res.status(201).json(order);
});

// PUT update order status
router.put('/:id/status', (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status || 'Shipped';
  res.json(order);
});

module.exports = router;
