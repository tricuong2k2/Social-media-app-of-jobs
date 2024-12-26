import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components-sma/topbar/Topbar";
import Sidebar from "../../components-sma/sidebar/Sidebar";
import Feed from "../../components-sma/feed/Feed";
import Rightbar from "../../components-sma/rightbar/Rightbar";
import "./CadidateIndex.module.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCandidateInfo } from "../../actions";
import { Dropdown } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

function Home() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const items = [
    {
      key: 1,
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: 2,
      label: "Log out",
      icon: <LogoutOutlined />,
    },
  ];
  useEffect(() => {

    Promise.all([
      // axios.get("http://localhost:8000/api/candidate/get-list/", { withCredentials: true }),
      axios.get("http://localhost:8000/api/posts/get-list/", { withCredentials: true })
    ])
      .then(([postsRes]) => {
        // console.log(candidateRes.data.info);
        setPosts(postsRes.data.data)
        console.log(postsRes.data.data);

        // dispatch(
        //   setCandidateInfo({
        //     uid: candidateRes.data.info._id,
        //     ...candidateRes.data.info.member,
        //   })
        // );


        console.log(postsRes.data);
      })
      .catch((error) => {
        console.log(error);
        const code = error.response?.status;
        if (code === 401 || code === 403) nav("/login");
      });
  }, []);

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <div
          className="box-down"
          style={{
            color: "red",
            width: "100px",
            height: "auto",
          }}
        >
          {/* <div>dada</div>
          <Dropdown menu={{ items }} placement="bottomRight">
            <LogoutOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
          </Dropdown> */}
        </div>
        <div className="homeSidebar">
          <Sidebar />
        </div>
        <div className="homeFeed">
          <Feed posts={posts} />
        </div>
        <div className="homeRightbar">
          <Rightbar />
        </div>
      </div>
    </>
  );
}
export default Home;
