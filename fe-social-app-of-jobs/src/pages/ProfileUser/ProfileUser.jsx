import React, { useEffect, useState } from "react";
import axios from "axios";
import Feed from "../../components-sma/feed/Feed";
import Topbar from "../../components-sma/topbar/Topbar";
import styles from "./ProfileUser.css";
import { Button, Input, Modal, Form, message, DatePicker, Radio, Upload } from 'antd';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';



const primaryColor = "#00b14f";
function ProfileUser() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();



  // Gọi API bài viết chỉ khi user._id đã có giá trị
  useEffect(() => {
    if (user.id) {
      axios
        .get(`http://localhost:8000/api/posts/user/${user.id}`, { withCredentials: true })
        .then((response) => {
          if (response.data && response.data.data) {
            setPosts(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API bài viết", error);
        });
    }
  }, [user._id]);
  const handleUpdateInfo = async (values) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/${user.role}/info`,
        {
          ...values,
          dob: values.dob?.format('YYYY-MM-DD'),
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedUser = { ...user, ...response.data.info.member };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        message.success('Cập nhật thông tin thành công!');
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      message.error('Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };




  return (
    console.log('posts: ', posts),
    <div className="profile">
      <Topbar />
      <div className="bigAvatar">
        <div className="info">
          <div className="avatar">
            <img src={user?.avatar} alt="avatar" />
          </div>
          <div className="infoText">
            <h1 className="name">{user?.fullName || "Tên không có"}</h1>
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsModalVisible(true)}
              style={{ backgroundColor: primaryColor, color: 'white' }}
            >
              Chỉnh sửa thông tin
            </Button>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="box-1">
          <Feed posts={posts} feedStyle="profile" />
        </div>
        <div className="box-2">
          <div className="userInfoBox">
            <h2>Thông tin người dùng</h2>
            <ul>
              <li><strong>Email:</strong> {user?.email || "Chưa cập nhật"}</li>
              <li><strong>Số điện thoại:</strong> {user?.tel || "Chưa cập nhật"}</li>
              <li><strong>Ngày sinh:</strong> {user?.dob ? moment(user.dob).format('DD/MM/YYYY') : "Chưa cập nhật"}</li>
              <li><strong>Giới tính:</strong> {user?.gender === 'male' ? 'Nam' : 'Nữ'}</li>
              <li><strong>Địa chỉ:</strong> {user?.address || "Chưa cập nhật"}</li>
            </ul>
          </div>
        </div>
      </div>
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ...user,
            dob: user.dob ? moment(user.dob) : null
          }}
          onFinish={handleUpdateInfo}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tel"
            label="Số điện thoại"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Ngày sinh"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
          >
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input />
          </Form.Item>

          {/* <Form.Item
            name="avatar"
            label="Ảnh đại diện"
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: primaryColor }}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProfileUser;
