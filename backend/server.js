require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// ── Middleware ───────────────────────────────────────────────────────────────
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// ── Routes ──────────────────────────────────────────────────────────────────
const statsRoutes = require('./routes/stats.routes');
const pincodeRoutes = require('./routes/pincode.routes');
const statesRoutes = require('./routes/states.routes');
const searchRoutes = require('./routes/search.routes');
const exportRoutes = require('./routes/export.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Database ────────────────────────────────────────────────────────────────
connectDB();

// ── Global middleware ───────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

// ── API routes ──────────────────────────────────────────────────────────────
app.use('/api/stats', statsRoutes);
app.use('/api/pincodes', pincodeRoutes);
app.use('/api/states', statesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/export', exportRoutes);

// ── Root Endpoint (Health Check) ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'All-India-Pincode API is running successfully',
    documentation: 'https://github.com/vedantxy/indian_pin_codes'
  });
});

// ── Error handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Listen ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ Server running → http://localhost:${PORT}`);
});

module.exports = app;
