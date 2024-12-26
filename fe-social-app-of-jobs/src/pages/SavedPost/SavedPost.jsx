import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components-sma/topbar/Topbar";
import Sidebar from "../../components-sma/sidebar/Sidebar";
import Feed from "../../components-sma/feed/Feed";
import Rightbar from "../../components-sma/rightbar/Rightbar";
// import "./SavedPost.module.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCandidateInfo } from "../../actions";
import { Dropdown } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';
import { Alert, Button } from 'antd';

function SavedPost() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : {};
    });
    const userId = user.id;
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
        // Thêm console.log để debug
        console.log('Current user state:', user);
        console.log('User ID:', user.id);


        Promise.all([
            axios.get(`http://localhost:8000/api/posts/saved/${userId}/`, { withCredentials: true })
        ])
            .then(([postsRes]) => {
                const mappedPosts = postsRes.data.data.map(savedPost => savedPost.post_id);
                setPosts(mappedPosts);
                console.log(mappedPosts);

                console.log(postsRes.data);
            })
            .catch((error) => {
                console.log(error);
                const code = error.response?.status;
                if (code === 401 || code === 403) nav("/login");
            });
    }, []);

    if (!user || !userId) {
        return (
            <div style={{
                padding: '20px',
                maxWidth: '600px',
                margin: '100px auto'
            }}>
                <Alert
                    message="Thông báo"
                    description="Vui lòng đăng nhập để xem bài viết đã lưu!"
                    type="warning"
                    showIcon
                    action={
                        <Button size="small" type="primary" onClick={() => nav("/login")}>
                            Đăng nhập
                        </Button>
                    }
                />
            </div>
        );
    }

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
                </div>
                <div className="homeFeed">
                    <Feed posts={posts} />
                </div>
            </div>
        </>
    );
}
export default SavedPost;
