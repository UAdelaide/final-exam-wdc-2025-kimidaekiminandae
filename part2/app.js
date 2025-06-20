const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
  secret: 'dog-key',
  resave: false,
  saveUninitialized: true
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Serve static files and views and check user roles
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/owner-dashboard', (req, res) => {
  if (req.session.user?.role === 'owner') {
    return res.sendFile(path.join(__dirname, 'public/owner-dashboard.html'));
  }
  res.redirect('/');
});

app.get('/walker-dashboard', (req, res) => {
  if (req.session.user?.role === 'walker') {
    return res.sendFile(path.join(__dirname, 'public/walker-dashboard.html'));
  }
  res.redirect('/');
});

// Export the app instead of listening here
module.exports = app;