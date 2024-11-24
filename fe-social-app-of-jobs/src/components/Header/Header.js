import { Button, Layout } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

function Header(props) {
  const [hoverLogin, setHoverLogin] = useState(false);
  const [hoverRegister, setHoverRegister] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };
  const handleRegisterClick = () => {
    navigate("/employer/sign-up");
  };

  return (
    <div>
      <Layout>
        <div className={styles.headerEmployeer_index}>
          <div className={styles.headerEmployeer_logo} onClick={() => navigate("/")}>
            <img src="/logo.png" alt="logo" />
            <h1>Portal</h1>
          </div>
          <div className={styles.nav}></div>
          <div className={styles.button_container}>
            <Button
              onClick={handleLoginClick}
              className={styles.button_login}
              style={{
                backgroundColor: hoverLogin ? "#0fc862" : "#00b14f",
                color: hoverLogin ? "white" : "white",
                border: hoverLogin ? "1px solid #0fc862" : "1px solid #00b14f",
              }}
              onMouseEnter={() => setHoverLogin(true)}
              onMouseLeave={() => setHoverLogin(false)}
            >
              Đăng nhập
            </Button>
            <Button
              onClick={handleRegisterClick}
              className={styles.button_register}
              style={{
                backgroundColor: hoverRegister ? "rgb(230, 228, 228)" : "white",
                border: hoverRegister
                  ? "1px solid #0fc862"
                  : "1px solid #00b14f",
                color: hoverRegister ? "#0fc862" : "#00b14f",
              }}
              onMouseEnter={() => setHoverRegister(true)}
              onMouseLeave={() => setHoverRegister(false)}
            >
              Đăng ký
            </Button>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Header;
