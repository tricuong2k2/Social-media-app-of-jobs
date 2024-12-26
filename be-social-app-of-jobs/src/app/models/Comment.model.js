const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model('Comment', CommentSchema, "tblComment");

module.exports = Comment;
