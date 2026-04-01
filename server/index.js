const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// API Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Export app for Vercel
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ TechStore API running at http://localhost:${PORT}`);
  });
}
