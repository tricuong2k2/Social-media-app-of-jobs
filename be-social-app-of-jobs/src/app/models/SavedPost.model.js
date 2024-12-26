// models/SavedPost.model.js
const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  saved_at: {
    type: Date,
    default: Date.now
  }
});

// Tạo compound index để đảm bảo user không thể save trùng 1 post
savedPostSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

module.exports = mongoose.model('SavedPost', savedPostSchema);