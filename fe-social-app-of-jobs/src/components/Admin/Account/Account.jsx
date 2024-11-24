import { Button, Col, ConfigProvider, DatePicker, Form, Input, message, Radio, Row } from "antd";
import Avatar from "../../Avatar/Avatar";

import { BsFillTelephoneFill } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
import { FaBirthdayCake } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

import axios from "axios";
import moment from "moment";

import styles from "./Account.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setAdminInfo } from "../../../actions";
import { useNavigate } from "react-router-dom";

const primaryColor = "#00b14f";
const bgBlur = "#00b14f0a";

function Account() {
  const admin = useSelector(state => state.memberReducer);

  const [updateInfo, setUpdateInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  const handleUpdateInfo = async (values) => {
    values.dob = values.dob.$d;
    setUpdateInfo(false);
    setLoading(true);
    await axios.post("http://localhost:8000/api/admin/info", {
      ...values
    }, {
      withCredentials: true,
    })
      .then(res => {
        // console.log(res.data.info);
        messageApi.success("Cập nhật thông tin thành công");
        dispatch(setAdminInfo({ ...admin, ...res.data.info }));
      })
      .catch(err => {
        console.error(err?.response?.data?.message);
        messageApi.error(err?.response?.data?.message || "Cập nhật không thành công");
        const code = err.response.status;
        if (code === 401 || code === 403)
          nav("/login");
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className={styles.account}>
      {contextHolder}
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: primaryColor,
              colorPrimaryHover: "#00b150bf",
              colorPrimaryActive: primaryColor,
              colorPrimaryBorder: bgBlur,
            }
          }
        }}
      >
        <div className={styles.info}>
          <h3 className={styles.adminName}>{admin.fullName}</h3>
          <p className={styles.role}>{admin.role}</p>
        </div>
        <div className={styles.avatar}>
          <Avatar
            API={{
              upload: "http://localhost:8000/api/admin/avatar",
              delete: "http://localhost:8000/api/admin/avatar"
            }}
          />
        </div>
        <div className={styles.info}>
          <p className={styles.address}><IoLocationSharp /><span>{admin.address || "Không xác định"}</span></p>
          <Row justify="center" align="middle" gutter={[24, 0]}>
            <Col>
              <p className={styles.tel}><BsFillTelephoneFill /><span>{admin.tel || "Không xác định"}</span></p>
            </Col>
            <Col>
              <p className={styles.email}><TfiEmail /><span>{admin.email || "Không xác định"}</span></p>
            </Col>
            <Col>
              <p className={styles.dob}><FaBirthdayCake /><span>{admin.dob
                ? formatDate(admin.dob)
                : "Không xác định"}</span></p>
            </Col>
          </Row>
        </div>
        {updateInfo ? (
          <div className={styles.updateInfo}>
            <Form
              layout="vertical"
              onFinish={handleUpdateInfo}
            >
              <Row justify="space-between" gutter={[12, 0]}>
                <Col span={12}>
                  <Form.Item
                    label={<span className={styles.lbUpdateFrm}>Họ tên</span>}
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập họ tên của bạn',
                      }
                    ]}
                    initialValue={admin.fullName}
                  >
                    <Input placeholder="Email"
                      addonBefore={<span className={styles.icon}><MdOutlineDriveFileRenameOutline /></span>} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label={<span className={styles.lbUpdateFrm}>Số điện thoại</span>}
                    name="tel"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại của bạn',
                      },
                      {
                        pattern: /^\d{7,15}$/,
                        message: 'Số điện thoại không hợp lệ'
                      }
                    ]}
                    initialValue={admin.tel}
                  >
                    <Input placeholder="Số điện thoại"
                      addonBefore={<span className={styles.icon}><BsFillTelephoneFill /></span>} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span className={styles.lbUpdateFrm}>Ngày sinh</span>}
                    name="dob"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn ngày sinh của bạn',
                      }
                    ]}
                    initialValue={moment(admin.dob)}
                  >
                    <DatePicker format={{ format: 'DD-MM-YYYY' }} placeholder="Ngày sinh" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span className={styles.lbUpdateFrm}>Giới tính</span>}
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn giới tính'
                      }
                    ]}
                    initialValue={admin.gender}
                  >
                    <Radio.Group size="large" >
                      <Radio value="male">Nam</Radio>
                      <Radio value="female">Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={<span className={styles.lbUpdateFrm}>Địa chỉ</span>}
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập địa chỉ của bạn'
                      }
                    ]}
                    initialValue={admin.address}
                  >
                    <Input placeholder="Địa chỉ"
                      addonBefore={<span className={styles.icon}><FaLocationDot /></span>} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <div className={styles.submitWrapper}>
                  <Button
                    type="primary"
                    block size="large"
                    htmlType="submit" loading={loading}
                    className={styles.btnLogin}
                  >
                    Lưu
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div className={styles.changeInfo} onClick={() => setUpdateInfo(true)}>
            <Button type="primary">Chỉnh sửa thông tin cá nhân</Button>
          </div>
        )}
      </ConfigProvider>
    </div>
  );
}

export default Account;