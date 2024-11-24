import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCandidateInfo } from "../../actions";
import CandidateAvatar from '../Avatar/CandidateAvatar';

const userInfoStyle = {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
};

const UserInfo = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.memberReducer);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/candidate/info/', { withCredentials: true });
                const userData = response.data.info.member;
                dispatch(setCandidateInfo({
                    fullName: userData.fullName,
                    email: userData.email,
                    tel: userData.tel,
                    address: userData.address,
                    avatar: userData.avatar,
                }));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [dispatch]);

    return (
        <div style={userInfoStyle}>
            <div>
                <CandidateAvatar API={{
                    upload: "http://localhost:8000/api/candidate/avatar",
                    delete: "http://localhost:8000/api/candidate/avatar"
                }} />
                <span style={{ fontSize: '24px' }}>{user.fullName}</span>
                <p>Chào mừng bạn trở lại, <strong style={{ color: "#00CC00" }}>{user.fullName}</strong>. Hãy làm nổi bật hồ sơ của mình nhé!</p>
            </div>
            <div>
                <h2>Thông tin cá nhân</h2>
                <p><strong>Tên:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Số điện thoại:</strong> {user.tel}</p>
                <p><strong>Địa chỉ:</strong> {user.address}</p>
            </div>
        </div>
    );
};

export default UserInfo;
