import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
} from "@mui/icons-material";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Đoạn chat</span>
          </li>
          <li
            className="sidebarListItem"
            onClick={() => navigate('/saved-post')} // Thêm onClick handler
            style={{ cursor: 'pointer' }} // Thêm style để hiển thị là có thể click
          >
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Đã lưu</span>
          </li>
        </ul>
        {/*
        <button className="sidebarButton">Xem thêm</button>
        */}
        <hr className="sidebarHr" />
        {/* <ul className="sidebarFriendList">
          {Users.slice(0, 8).map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
        </ul> */}
      </div>
    </div>
  );
}
