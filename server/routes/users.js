const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET all users
router.get('/', (req, res) => {
  const safe = store.users.map(({ password, ...u }) => u);
  res.json(safe);
});

// DELETE user
router.delete('/:id', (req, res) => {
  const idx = store.users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (store.users[idx].role === 'admin') return res.status(403).json({ error: 'Cannot delete admin' });
  store.users.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router;
