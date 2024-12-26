const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const SavedPost = require("../models/SavedPost.model");
const Job = require("../models/Job.model");
const path = require("path");
const fs = require('fs');

const response = (res, status, payload) => {
    return res.status(status).json(payload);
};

class PostsController {
    async getListPosts(req, res) {
        try {
            const {page = 1, limit = 10} = req.query;
            const skip = (page - 1) * limit;

            const posts = await Post.find()
                .sort({created_at: -1})
                .skip(skip)
                .limit(limit)
                .populate("author_id", "fullName avatar _id")
                .populate("job_id")
                .populate('likes', 'fullName avatar _id')
                .populate({
                    path: "original_post_id",
                    populate: {path: "author_id", select: "fullName avatar _id"},
                })
                .exec();

            const totalPosts = await Post.countDocuments();

            const totalPages = Math.ceil(totalPosts / limit);
            const result = {
                currentPage: page,
                totalPages: totalPages,
                totalPosts: totalPosts,
                data: posts,
            };
            return response(res, 200, result);
        } catch (error) {
            console.log(error);
            return response(res, 500, {messsage: "Error from server"});
        }
    }

    async getPostsById(req, res) {
        try {
            const {id} = req.params;

            const post = await Post.findById(id)
                .populate("author_id", "fullName avatar _id")
                .populate("job_id")
                .populate({
                    path: "original_post_id",
                    populate: {path: "author_id", select: "fullName avatar _id"},
                });
            let result = {
                message: "Post not found",
            };
            if (!post) {
                return response(res, 404, result);
            } else {
                result = {data: post};
            }
            return response(res, 200, result);
        } catch (error) {
            console.log(error);
            return response(res, 500, {messsage: "Error from server"});
        }
    }

    async getListCommentByPostId(req, res) {
        try {
            const {id} = req.params;
            const {page = 1, limit = 10} = req.query;
            const skip = (page - 1) * limit;

            const comments = await Comment.find({post_id: id})
                .sort({created_at: -1})
                .skip(skip)
                .limit(limit)
                .populate("user_id", "fullName avatar _id")
                .exec();
            const result = {data: comments};
            return response(res, 200, result);
        } catch (error) {
            console.log(error);
            return response(res, 500, {messsage: "Error from server"});
        }
    }

    async uploadNewPost(req, res) {
        try {
            const {content, author_id, visibility, job_id} = req.body;
            const media = req.files ? req.files.map((file) => file.filename) : [];
            if (!content || !author_id) {
                return response(res, 400, {message: "Content and author_id are required"});
            }
            if (job_id) {
                const job = await Job.findById(job_id);
                if (!job) {
                    return response(res, 404, {message: "Job not found"});
                }
            }

            const post = new Post({
                content,
                author_id,
                media,
                job_id,
                is_shared: false,
                original_post_id: null,
                visibility,
                comments_count: 0,
                shares_count: 0,
            });

            await post.save();
            const result = {data: post};
            return response(res, 201, result);
        } catch (error) {
            console.log(error);
            return response(res, 500, {messsage: "Error from server"});
        }
    }

    async editPost(req, res) {
        try {
            const postId = req.params.id;
            const {content, visibility} = req.body;

            const post = await Post.findById(postId);
            if (!post) {
                return response(res, 404, {message: 'Post not found'});
            }
            // phân quyển tự xử lí nhé
            // if (post.author_id.toString() !== req.user._id.toString()) {
            //   return response(res, 403, { message: 'You are not authorized to edit this post' });
            // }

            post.content = content || post.content;
            post.visibility = visibility || post.visibility;

            if (req.files && req.files.length > 0) {
                const media = req.files.map(file => file.filename);
                post.media = media;
            }

            await post.save();

            const result = {data: post};
            return response(res, 200, result);
        } catch (error) {
            console.log(error);
            return response(res, 500, {messsage: "Error from server"});
        }
    }

    async deletePost(req, res) {
        try {
            const postId = req.params.id;

            const post = await Post.findById(postId);
            if (!post) {
                return response(res, 404, {message: 'Post not found'});
            }

            // phân quyển tự xử lí nhé
            // if (post.author_id.toString() !== req.user._id.toString()) {
            //   return response(res, 403, { message: 'You are not authorized to edit this post' });
            // }

            if (post.media && post.media.length > 0) {
                post.media.forEach(file => {
                    const filePath = path.join(__dirname, '../uploads', file);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }

            await Post.findByIdAndDelete(postId);
            return response(res, 200, {message: 'Post deleted successfully'});
        } catch (error) {
            console.log(error);
            return response(res, 500, {messsage: "Error from server"});
        }
    }

    async sharePost(req, res) {
        try {
            const postId = req.params.id;
            const {content, author_id, visibility} = req.body;

            const post = await Post.findById(postId);
            if (!post) {
                return response(res, 404, {message: 'Post not found'});
            }

            if (post.visibility !== 'public') {
                return response(res, 403, {message: 'This post is not available for sharing'});
            }

            const sharedPost = new Post({
                author_id,
                content,
                media: [],
                is_shared: true,
                original_post_id: postId,
                visibility,
            });

            await sharedPost.save();
            post.shares_count += 1;
            await post.save();
            return response(res, 200, {message: 'Post shared successfully', data: sharedPost});
        } catch (error) {
            console.log(error);
            return response(res, 500, {messsage: "Error from server"});
        }
    }

    async uploadComment(req, res) {
        try {
            const {content, user_id} = req.body;
            const postId = req.params.postId;

            const post = await Post.findById(postId);
            if (!post) {
                return response(res, 404, {message: 'Post not found'});
            }

            const newComment = new Comment({
                content,
                post_id: postId,
                user_id
            });

            await newComment.save();

            post.comments_count += 1;
            await post.save();
            return response(res, 200, {message: 'Comment added successfully', data: newComment});
        } catch (error) {
            console.log(error);
            return response(res, 500, {messsage: "Error from server"});
        }
    }

    async editComment(req, res) {
        try {
            const {content} = req.body;
            const commentId = req.params.commentId;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return response(res, 404, {message: 'Post not found'});
            }

            // authen tự sửa nhé
            // if (comment.author_id.toString() !== req.user._id.toString()) {
            //   return res.status(403).json({ message: 'You are not authorized to edit this comment' });
            // }

            comment.content = content;
            await comment.save();
            return response(res, 200, {message: 'Comment edited successfully', data: comment});
        } catch (error) {
            console.log(error);
            return response(res, 500, {messsage: "Error from server"});
        }
    }

    async deleteComment(req, res) {
        try {
            const commentId = req.params.commentId;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return response(res, 404, {message: 'Post not found'});
            }

            // authen tự sửa nhé
            // if (comment.author_id.toString() !== req.user._id.toString()) {
            //   return res.status(403).json({ message: 'You are not authorized to delete this comment' });
            // }

            await Comment.findByIdAndDelete(commentId);

            const post = await Post.findById(comment.post_id);
            post.comments_count -= 1;
            await post.save();
            return response(res, 200, {message: 'Comment deleted successfully', data: comment});
        } catch (error) {
            console.log(error);
            return response(res, 500, {messsage: "Error from server"});
        }
    }

    async savePost(req, res) {
        try {
            const {user_id} = req.body;
            const post_id = req.params.id;

            // Kiểm tra post có tồn tại
            const post = await Post.findById(post_id);
            if (!post) {
                return response(res, 404, {message: 'Post not found'});
            }

            // Kiểm tra và tạo saved post
            const savedPost = new SavedPost({
                user_id,
                post_id
            });

            await savedPost.save();
            return response(res, 200, {message: 'Post saved successfully'});

        } catch (error) {
            // Nếu lỗi do trùng lặp (đã save trước đó)
            if (error.code === 11000) {
                return response(res, 400, {message: 'Post already saved'});
            }
            console.log(error);
            return response(res, 500, {message: 'Error from server'});
        }
    }

    // API xóa bài post đã lưu
    async unsavePost(req, res) {
        try {
            const {user_id} = req.body;
            const post_id = req.params.id;

            const result = await SavedPost.findOneAndDelete({
                user_id,
                post_id
            });

            if (!result) {
                return response(res, 404, {message: 'Saved post not found'});
            }

            return response(res, 200, {message: 'Post unsaved successfully'});

        } catch (error) {
            console.log(error);
            return response(res, 500, {message: 'Error from server'});
        }
    }

    // API lấy danh sách bài post đã lưu
    async getSavedPosts(req, res) {
        try {
            const {user_id} = req.params;
            const {page = 1, limit = 10} = req.query;
            const skip = (page - 1) * limit;

            const savedPosts = await SavedPost.find({user_id})
                .sort({saved_at: -1})
                .skip(skip)
                .limit(limit)
                .populate({
                    path: 'post_id',
                    populate: {
                        path: 'author_id',
                        select: 'fullName avatar _id'
                    }
                })
                .exec();

            const totalSaved = await SavedPost.countDocuments({user_id});
            const totalPages = Math.ceil(totalSaved / limit);

            const result = {
                currentPage: parseInt(page),
                totalPages,
                totalSaved,
                data: savedPosts
            };

            return response(res, 200, result);

        } catch (error) {
            console.log(error);
            return response(res, 500, {message: 'Error from server'});
        }
    }

    // API like/unlike post
    async toggleLike(req, res) {
        try {
            const {user_id} = req.body;
            const post_id = req.params.id;

            const post = await Post.findById(post_id);
            if (!post) {
                return response(res, 404, {message: 'Post not found'});
            }

            const hasLiked = post.likes.includes(user_id);

            if (hasLiked) {
                // Unlike: Remove user from likes array
                post.likes = post.likes.filter(id => id.toString() !== user_id);
            } else {
                // Like: Add user to likes array
                post.likes.push(user_id);
            }

            await post.save();

            return response(res, 200, {
                message: hasLiked ? 'Post unliked' : 'Post liked',
            });

        } catch (error) {
            console.log(error);
            return response(res, 500, {message: 'Error from server'});
        }
    }

// API lấy danh sách người like
    async getLikes(req, res) {
        try {
            const {id} = req.params;
            const {page = 1, limit = 10} = req.query;
            const skip = (page - 1) * limit;

            const post = await Post.findById(id)
                .populate({
                    path: 'likes',
                    select: 'fullName avatar _id',
                    options: {skip, limit}
                });

            if (!post) {
                return response(res, 404, {message: 'Post not found'});
            }

            return response(res, 200, {
                total_likes: post.likes_count,
                users: post.likes
            });

        } catch (error) {
            console.log(error);
            return response(res, 500, {message: 'Error from server'});
        }
    }

    // API lấy danh sách bài post theo user_id
    async getPostsByUserId(req, res) {
        try {
            const {user_id} = req.params;
            const {page = 1, limit = 10} = req.query;
            const skip = (page - 1) * limit;

            const posts = await Post.find({author_id: user_id})
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit)
                .populate("author_id", "fullName avatar _id")
                .populate("job_id")
                .populate('likes', 'fullName avatar _id')
                .populate({
                    path: "original_post_id",
                    populate: {path: "author_id", select: "fullName avatar _id"},
                })
                .exec();

            const totalPosts = await Post.countDocuments({author_id: user_id});
            const totalPages = Math.ceil(totalPosts / limit);

            const result = {
                currentPage: parseInt(page),
                totalPages,
                totalPosts,
                data: posts
            };

            return response(res, 200, result);
        } catch (error) {
            console.log(error);
            return response(res, 500, {message: "Error from server"});
        }
    }

}

module.exports = new PostsController();
