const express = require('express');
const router = express.Router();
const store = require('../data/store');

// POST login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = store.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return res.status(401).json({ ok: false, msg: 'Invalid email or password.' });
  const session = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({ ok: true, user: session });
});

// POST register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ ok: false, msg: 'All fields are required.' });
  if (store.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ ok: false, msg: 'Email already registered.' });
  }
  const newUser = {
    id: store.getNextUserId(), name, email, password,
    role: 'user', joined: new Date().toISOString(), orders: 0
  };
  store.users.push(newUser);
  const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  res.status(201).json({ ok: true, user: session });
});

module.exports = router;
