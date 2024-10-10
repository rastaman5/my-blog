// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  
  // Middleware
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));
  
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));
  
  app.use(flash());
  
  // Global Variables for Flash Messages
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
  });
  
  // Routes
  const postsRouter = require('./routes/posts');
  app.use('/posts', postsRouter);
  
  // Home Route
  app.get('/', (req, res) => {
    res.redirect('/posts');
  });
  
  // Start Server
  const PORT = process.env.PORT || 2000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });