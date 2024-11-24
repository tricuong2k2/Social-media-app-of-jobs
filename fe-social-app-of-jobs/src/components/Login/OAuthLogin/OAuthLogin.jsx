import { Button, Checkbox, Col, Row } from "antd";

import styles from "./OAuthLogin.module.css";
import { FaFacebook, FaGoogle, FaLinkedin } from "react-icons/fa";
import { useState } from "react";

function OAuthLogin({ thirdParties = [], role="candidate" }) {
  const [confirmPolicy, setConfirmPolicy] = useState(false);

  return (
    <div className={styles.oauthLogin}>
      <Row justify="space-between" gutter={16}>
        {
          thirdParties.includes('google') ? (
            <Col span={24 / thirdParties.length}>
              <Button type="primary" size="large" disabled={!confirmPolicy}
                icon={<span className={styles.icon}><FaGoogle /></span>}
                className={styles.loginWithGoogle}
              > Google </Button>
            </Col>
          ) : (<></>)
        }

        {
          thirdParties.includes('facebook') ? (
            <Col span={24 / thirdParties.length}>
              <Button type="primary" size="large" disabled={!confirmPolicy || role !== "candidate"}
                icon={<span className={styles.icon}><FaFacebook /></span>}
                className={styles.loginWithFacebook}
              > Facebook </Button>
            </Col>
          ) : (<></>)
        }

        {
          thirdParties.includes('linkedin') ? (
            <Col span={24 / thirdParties.length}>
              <Button type="primary" size="large" disabled={!confirmPolicy || role !== "candidate"}
                icon={<span className={styles.icon}><FaLinkedin /></span>}
                className={styles.loginWithLinkedin}
              > Linkedin </Button>
            </Col>
          ) : (<></>)
        }
      </Row>

      <div className={styles.confirmPolicy}>
        <Checkbox
          disabled={role === "admin"}
          checked={confirmPolicy}
          onChange={() => {
            setConfirmPolicy(!confirmPolicy);
          }}
        >
          Bằng việc đăng nhập bằng tài khoản mạng xã hội, tôi đã đọc và đồng ý với
          <a href="/terms-of-service"> Điều khoản dịch vụ</a> và
          <a href="/privacy-policy"> Chính sách bảo mật</a> của PTIT
        </Checkbox>
      </div>
    </div>
  )
}

export default OAuthLogin;