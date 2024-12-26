import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions } from "@mui/icons-material"
import { useState } from "react";
import { Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
const { TextArea } = Input;

export default function Share() {
  const [content, setContent] = useState("");
  const [jobId, setJobId] = useState(""); // State cho job ID
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const handleSubmit = async () => {
    if (!content.trim()) {
      messageApi.warning("Vui lòng nhập nội dung bài viết!");
      return;
    }
    try {
      await axios.post("http://localhost:8000/api/posts/upload", {
        content,
        author_id: user.id,
        visibility: "public",
        job_id: jobId || null // Nếu không có jobId thì gửi null
      }, {
        withCredentials: true
      });

      messageApi.success("Đã đăng bài thành công!");
      // Reset form
      setContent("");
      setJobId("");

    } catch (error) {
      console.error(error);
      messageApi.error("Đăng bài thất bại!");
    }
  };

  return (
    <div className="share">
      {contextHolder}
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src="/assets/person/1.jpeg" alt="" />
          <div style={{ width: '100%' }}>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ suy nghĩ của bạn..."
              autoSize={{ minRows: 3 }}
              className="shareInput"
              style={{ marginBottom: '10px' }}
            />
            {user.role !== "candidate" && (
              <Input
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                placeholder="Nhập Job ID (không bắt buộc)"
                style={{ marginBottom: '10px' }}
              />
            )}
          </div>
        </div>
        <hr className="shareHr" />
        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Ảnh hoặc video</span>
            </div>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Gắn thẻ</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Địa điểm</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Cảm xúc</span>
            </div>
          </div>
          <button className="shareButton" onClick={handleSubmit}>Chia sẻ</button>
        </div>
      </div>
    </div>
  );
}
