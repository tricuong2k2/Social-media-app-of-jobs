import { Button, Checkbox, Form, Input, message, Modal } from "antd";
import { MdEmail } from "react-icons/md";
import { BsShieldFillCheck, BsShieldLockFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

import axios from "axios";

import styles from "./SignUpForm.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUpForm({ children, role="candidate" }) {
  const [loading, setLoading] = useState(false);
  const [sendMail, setSendMail] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [resend, setResend] = useState(false);

  const nav = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const [confirmPolicy, setConfirmPolicy] = useState(false);

  const validateRetypePassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (value) {
        if (getFieldValue('password') === value)
          return Promise.resolve();
        else
          return Promise.reject(new Error('Mật khẩu nhập lại không khớp với mật khẩu đã nhập'));
      }

      return Promise.resolve();
    }
  });

  const handleSubmitSignUpFrm = (values) => {
    console.log(values);
    setLoading(true);
    axios.post(`http://localhost:8000/auth/sign-up/${role}`, values)
      .then(res => {
        console.log(res.data);
        setSendMail(values.email);
        setOpenModal(true);
      })
      .catch(err => {
        console.error(err);
        messageApi.error(err.response.data.message);
      })
      .finally(() => setLoading(false))
  };

  const handleResendEmail = () => {
    setResend(true);
    axios.post(`http://localhost:8000/auth/send-mail`, {
      email: sendMail,
    })
      .then(res => {
        messageApi.info("Đã gửi lại mail đến email của bạn!");
      })
      .catch(err => {
        console.error(err);
        messageApi.error(err.response?.data.message);
      })
      .finally(() => setResend(false))
  };

  return (
    <div className={styles.signUp}>
      {contextHolder}
      <Form
        layout="vertical"
        onFinish={handleSubmitSignUpFrm}
      >
        <Form.Item
          label={<span className={styles.lbSignUpFrm}>Họ và tên</span>}
          name="fullName"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập họ tên của bạn',
            }
          ]}
        >
          <Input size="large" placeholder="Họ và tên" className={styles.field}
            addonBefore={<span className={styles.icon}><FaUser /></span>} />
        </Form.Item>

        <Form.Item
          label={<span className={styles.lbSignUpFrm}>Email</span>}
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập địa chỉ email của bạn',
            },
            {
              type: 'email',
              message: 'Email bạn nhập không hợp lệ',
            }
          ]}
        >
          <Input size="large" placeholder="Email" className={styles.field}
            addonBefore={<span className={styles.icon}><MdEmail /></span>} />
        </Form.Item>

        <Form.Item
          label={<span className={styles.lbSignUpFrm}>Mật khẩu</span>}
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu của bạn',
            },
            {
              min: 6,
              max: 25,
              message: 'Mật khẩu phải chứa từ 6 đến 25 ký tự',
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d@$!%*?&].{6,25}$/,
              message: 'Mật khẩu phải bao gồm ít nhất 1 chữ hoa, chữ thường, ký tự số và ký tự đặc biệt'
            }
          ]}
        >
          <Input.Password size="large" placeholder="Mật khẩu ( từ 6 đến 25 ký tự )" className={styles.field}
            addonBefore={<span className={styles.icon}><BsShieldLockFill /></span>} />
        </Form.Item>

        <Form.Item
          label={<span className={styles.lbSignUpFrm}>Xác nhận mật khẩu</span>}
          name="confirm-password"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Vui lòng xác nhận lại mật khẩu của bạn',
            },
            validateRetypePassword,
          ]}
        >
          <Input.Password size="large" placeholder="Xác nhận mật khẩu" className={styles.field}
            addonBefore={<span className={styles.icon}><BsShieldFillCheck /></span>} />
        </Form.Item>

        {children}

        <div className={styles.confirmPolicy}>
          <Checkbox
            checked={confirmPolicy}
            onChange={() => {
              setConfirmPolicy(!confirmPolicy);
            }}
          >
            Tôi đã đọc và đồng ý với
            <a href="/terms-of-service"> Điều khoản dịch vụ</a> và
            <a href="/privacy-policy"> Chính sách bảo mật của PTIT</a>
          </Checkbox>
        </div>

        <Form.Item>
          <Button
            type="primary"
            block size="large"
            disabled={!confirmPolicy}
            htmlType="submit" loading={loading}
            className={styles.btnSignUp}
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title={<div className={styles.center}>
          <img src="/email.png" alt="Email Logo" className={styles.emailImg} />
          <h3 className={styles.center}>Vui lòng xác minh email của bạn</h3>
        </div>}
        open={openModal}
        closable={false}
        cancelButtonProps={{ hidden: true }}
        centered
        footer={<div className={styles.center}>
          <Button className={styles.btnResend} onClick={handleResendEmail} loading={resend} >Gửi lại</Button>
          <Button className={styles.btnResend} onClick={() => nav("/login")} >Đăng nhập</Button>
        </div>}
      >
        <div className={styles.center}>
          <p>Chúng tôi đã gửi một email đến địa chỉ <strong>{sendMail}</strong>. 
          <br /> Click vào liên kết trong email để xác minh tài khoản của bạn.</p>
        </div>
      </Modal>
    </div>
  )
}

export default SignUpForm;