const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        media: {
            type: [String],
            default: []
        },
        job_id: {  // Thêm field job_id
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            default: null  // Có thể null nếu post không liên quan đến job
        },
        likes: [{  // Thêm array chứa user_id đã like
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member'
        }],
        is_shared: {
            type: Boolean,
            default: false
        },
        original_post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default: null
        },
        visibility: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'public'
        },
        comments_count: {
            type: Number,
            default: 0
        },
        shares_count: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", PostSchema, "tblPost");