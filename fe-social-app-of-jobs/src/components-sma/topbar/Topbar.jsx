import React from "react";
import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";

export default function Topbar() {
  const [isCheck, setIsCheck] = React.useState(false);
  const navigate = useNavigate()
  const handleDropDown = () => {
    setIsCheck(!isCheck);
  };
  const redirectProfile = () =>{
    return navigate('/profile')
  }
  const redirectHome = () =>{
    return navigate('/login')
  }
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo"><img src="/logo.png" alt="" /></span>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Tìm kiếm bạn bè, bài viết, nhà tuyển dụng,..."
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person className="topbarIcon" />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat className="topbarIcon" />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications className="topbarIcon" />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <img
          onClick={handleDropDown}
          src="/assets/person/1.jpeg"
          alt=""
          className="topbarImg"
        />
        {isCheck && (
          <div className="dropdown">
            <ul>
              <li onClick={redirectProfile}>
                <span>Profile</span>
              </li>
              <li onClick={redirectHome}>
                <span>Log Out</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
