// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render('index', { posts });
  } catch (err) {
    req.flash('error_msg', 'Error retrieving posts');
    res.redirect('/');
  }
});

// GET form to create new post
router.get('/new', (req, res) => {
  res.render('posts/new');
});

// POST create a new post
router.post('/', async (req, res) => {
  const { title, body } = req.body;
  let errors = [];

  if (!title || !body) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (errors.length > 0) {
    res.render('posts/new', { errors, title, body });
  } else {
    try {
      const newPost = new Post({ title, body });
      await newPost.save();
      req.flash('success_msg', 'Post added successfully');
      res.redirect('/posts');
    } catch (err) {
      req.flash('error_msg', 'Error creating post');
      res.redirect('/posts');
    }
  }
});

// GET single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }
    res.render('posts/show', { post });
  } catch (err) {
    req.flash('error_msg', 'Error retrieving post');
    res.redirect('/posts');
  }
});

// GET form to edit a post
router.get('/:id/edit', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }
    res.render('posts/edit', { post });
  } catch (err) {
    req.flash('error_msg', 'Error retrieving post');
    res.redirect('/posts');
  }
});

// PUT update a post
router.put('/:id', async (req, res) => {
  const { title, body } = req.body;
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }
    post.title = title;
    post.body = body;
    await post.save();
    req.flash('success_msg', 'Post updated successfully');
    res.redirect('/posts');
  } catch (err) {
    req.flash('error_msg', 'Error updating post');
    res.redirect('/posts');
  }
});

// DELETE a post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Post deleted successfully');
    res.redirect('/posts');
  } catch (err) {
    req.flash('error_msg', 'Error deleting post');
    res.redirect('/posts');
  }
});

module.exports = router;