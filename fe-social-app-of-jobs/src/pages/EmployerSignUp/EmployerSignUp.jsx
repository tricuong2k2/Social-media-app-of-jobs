import clsx from "clsx";

import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";

import SignUpForm from "../../components/SignUpForm/SignUpForm";
import CompanyRegister from "../../components/CompanyRegister/CompanyRegister"
import styles from "./EmployerSignUp.module.css";

function EmployerSignUp() {
  const nav = useNavigate();

  return (
    <>
      <div className={styles.signUpSection}>
        <Row>
          <Col lg={15}>
            <div className={styles.signUpForm}>
              <div className={styles.mainForm}>
                <div className={styles.header}>
                  <h2 className={styles.title}>Đăng ký tài khoản Nhà tuyển dụng</h2>
                  <div className={styles.desc}>Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel.</div>
                </div>

                <div className={styles.account}>
                  <h2>Tài khoản</h2>
                  <SignUpForm role="employer">
                    <CompanyRegister />
                  </SignUpForm>
                </div>

                <div className={styles.register}>
                  <span>Bạn đã có tài khoản? </span>
                  <span
                    className={styles.loginNow}
                    onClick={() => nav("/login")}
                  >Đăng nhập ngay</span>
                </div>
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

export default EmployerSignUp;