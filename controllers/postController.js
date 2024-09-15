const Post = require('../models/postModel');

// Create Post
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  
  try {
    const post = new Post({ title, content, user: req.user.id });
    await post.save();
    
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Posts (with pagination, filtering, and sorting)
exports.getPosts = async (req, res) => {
  const { page = 1, limit = 10, sort = 'createdAt', filter } = req.query;

  try {
    const posts = await Post.find(filter ? { title: new RegExp(filter, 'i') } : {})
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Post
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  
  try {
    const post = await Post.findByIdAndUpdate(id, req.body, { new: true });
    
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  
  try {
    await Post.findByIdAndDelete(id);
    
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
