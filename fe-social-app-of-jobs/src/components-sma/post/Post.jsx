import "./post.css";
import {
  MoreVert,
  Send,
  Share,
  BookmarkAdd,
  ThumbUp,
  Comment,
} from "@mui/icons-material";
import { UserOutlined } from '@ant-design/icons';
import axios from "axios";
import { Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";

export default function Post({ post, refreshPosts }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user.id));
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('')
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, post._id]);;


  // Xử lý like/unlike
  const likeHandler = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/posts/like/${post._id}`, {
        user_id: user.id
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        // Update local state
        if (isLiked) {
          setLikes(prevLikes => prevLikes.filter(id => id !== user.id));
        } else {
          setLikes(prevLikes => [...prevLikes, user.id]);
        }
        setIsLiked(!isLiked);

        setAlertMessage(isLiked ? 'Đã bỏ thích bài viết' : 'Đã thích bài viết');
        setAlertType('success');
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

        // Refresh posts list if provided
        if (refreshPosts) {
          refreshPosts();
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setAlertMessage('Có lỗi xảy ra khi thích/bỏ thích bài viết');
      setAlertType('error');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  // Lấy comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/posts/get-comment/${post._id}`, {
        withCredentials: true
      });
      setComments(res.data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Submit comment mới
  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://localhost:8000/api/posts/comment/upload/${post._id}`, {
        content: newComment,
        user_id: user.id
      }, {
        withCredentials: true
      });

      // Clear input và refresh comments
      setNewComment('');
      fetchComments();

      // Refresh posts từ parent
      if (refreshPosts) refreshPosts();

    } catch (error) {
      setAlertMessage('Lỗi khi thêm bình luận');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const handleApplyClick = () => {
    if (post.job_id?._id) {
      navigate(`/view-detail-job/${post.job_id._id}`);
    }
  };


  // Hàm lưu bài viết
  const handleSavePost = async (userId, postId) => {
    console.log('User ID:', userId);  // Kiểm tra giá trị userId
    console.log('Post ID:', postId);  // Kiểm tra giá trị postId
    try {
      const res = await axios.post(`http://localhost:8000/api/posts/save/${postId}`, {
        "user_id": `${userId}`
      });

      console.log('res: ', res)
      if (res.status === 200) {
        setAlertMessage('Đã lưu bài viết thành công!');
        setAlertType('success');
        setShowAlert(true);

        // Tự động ẩn alert sau 3 giây
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

      }
    } catch (err) {
      setAlertMessage(err.response?.data?.message || 'Lỗi khi lưu bài viết');
      setAlertType('error');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  return (
    <div className="post">
      {showAlert && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
          <Alert
            message={alertMessage}
            type={alertType}
            showIcon
            closable
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <div className="avatarContainer">
              <UserOutlined className="avatarIcon" />
            </div>
            <div className="postProfileUsernameDate">
              <span className="postUsername">{post.author_id.fullName}</span>
            </div>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.content}</span>
          <div className="postCenterImg">
            <img className="postImg" src={post.photo} alt="" />
          </div>
        </div>
        <div className="postBottom">
          {post.job_id && (
            <div className="postBottomApply">
              <button
                className="button"
                style={{ fontSize: "16px" }}
                onClick={handleApplyClick}
              >
                <Send />
                <span className="buttonTextApply">
                  Ứng tuyển {post.job_id.title}
                </span>
              </button>
            </div>
          )}
          <hr className="postBottomHr" />
          <div className="postBottom1">
            <div className="postBottomLeft">
              <img
                className="likeIcon"
                src="assets/like.png"
                onClick={likeHandler}
                alt=""
              />
              <img
                className="likeIcon"
                src="assets/heart.png"
                onClick={likeHandler}
                alt=""
              />
              {/* <span className="postLikeCounter">{like}</span> */}
              <span className="postLikeCounter">{likes.length} lượt thích</span>
            </div>
            <div className="postBottomRight">
              <span className="postCommentText" onClick={() => setShowComments(!showComments)}>
                {post.comments_count} bình luận
              </span>
            </div>
          </div>
          {showComments && (
            <div className="comments-section">
              {comments.map(comment => (
                <div key={comment._id} className="comment">
                  <strong>{comment.user_id.fullName}</strong>: {comment.content}
                </div>
              ))}
              <div className="new-comment">
                <TextArea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  autoSize={{ minRows: 2 }}
                />
                <button onClick={handleComment}>Gửi</button>
              </div>
            </div>
          )}
          <hr className="postBottomHr" />
          <div className="postBottomButtons">
            <button className="button" onClick={likeHandler}>
              <ThumbUp style={{ color: isLiked ? 'blue' : 'gray' }} />
              <span className="buttonText">
                {isLiked ? 'Đã thích' : 'Thích'}
              </span>
            </button>
            <button className="button">
              <Comment />
              <span className="buttonText">Bình luận</span>
            </button>
            <button
              className="button"
              onClick={() => handleSavePost(post.author_id._id, post._id)} // Truyền post.author_id._id và post._id
            >
              <BookmarkAdd />
              <span className="buttonText">Lưu bài viết</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
