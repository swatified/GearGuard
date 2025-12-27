const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./config/database');

// Connect to database
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'GearGuard API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      docs: 'See API_DOCUMENTATION.md for full API reference'
    }
  });
});

// API Routes
app.use('/api', require('./routes'));

// API Routes will be added here as modules are created
// app.use('/api/auth', require('./routes/api/auth.routes'));
// app.use('/api/users', require('./routes/api/user.routes'));
// app.use('/api/equipment', require('./routes/api/equipment.routes'));
// app.use('/api/maintenance-teams', require('./routes/api/maintenanceTeam.routes'));
// app.use('/api/maintenance-requests', require('./routes/api/maintenanceRequest.routes'));
// app.use('/api/maintenance-stages', require('./routes/api/maintenanceStage.routes'));
// app.use('/api/dashboard', require('./routes/api/dashboard.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

