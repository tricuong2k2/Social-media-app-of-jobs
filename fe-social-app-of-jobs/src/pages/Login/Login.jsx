import { Col, Divider, message, Row } from "antd";
import axios from "axios";
import clsx from "clsx";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "../../actions";
import LoginForm from "../../components/Login/LoginForm/LoginForm";
import OAuthLogin from "../../components/Login/OAuthLogin/OAuthLogin";
import styles from "./Login.module.css";

function CandidateLogin() {
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const roles = [
    { label: "Ứng viên", value: "candidate" },
    { label: "Nhà tuyển dụng", value: "employer" },
    { label: "Quản trị viên", value: "admin" },
  ];

  const handleNavSignUp = () => {
    role === "candidate" ? nav("/candidate/sign-up") : nav("/employer/sign-up");
  }

  const handleSubmitLoginFrm = (values) => {
    setLoading(true);
    axios.post("http://localhost:8000/auth/login", values, {
      withCredentials: true,
    })
      .then(res => {
        dispatch(login(res.data));
        messageApi.success("Đăng nhập thành công", 1).then(() => {
          switch (values.role) {
            case "admin":
              nav("/admin/dashboard");
              break;
            case "employer":
              nav("/employer/posted-jobs");
              break;
            default:
              nav("/candidate");
          }
        });
      })
      .catch(err => {
        console.error(err.response?.data);
        console.log(err)
        messageApi.error(`Đăng nhập thất bại. ${err.response?.data.message || ""}`, 10);
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      <div className={styles.loginSection}>
        {contextHolder}
        <Row>
          <Col lg={15}>
            <div className={styles.loginForm}>
              <div className={styles.mainForm}>
                <div className={styles.header}>
                  <h2 className={styles.title}>Chào mừng bạn đã quay trở lại</h2>
                  <div className={styles.desc}>
                    {role === "candidate"
                      ? "Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng"
                      : "Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel"
                    }
                  </div>
                </div>

                <LoginForm
                  loading={loading}
                  changeRole={setRole}
                  roles={roles}
                  handleSubmitLoginFrm={handleSubmitLoginFrm}
                />

                {role !== "admin" ? (
                  <>
                    <Divider className={styles.useOthers}>Hoặc đăng nhập bằng</Divider>
                    <OAuthLogin thirdParties={["google", "facebook", "linkedin"]} role={role} />
                    <div className={styles.register}>
                      <span>Bạn chưa có tài khoản? </span>
                      <span
                        className={styles.signUpNow}
                        onClick={handleNavSignUp}
                      >Đăng ký ngay</span>
                    </div>
                  </>
                ) : (<></>)
                }
              </div>

              <div className={styles.authCopyRight}>
                © 2024. All Rights Reserved. PTIT Job Portal.
              </div>
            </div>
          </Col>
          <Col lg={9}>
            <div className={clsx([styles.formRegisterCompany, styles.bgLeft])}>

            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CandidateLogin;