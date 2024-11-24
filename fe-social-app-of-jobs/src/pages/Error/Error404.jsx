import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./Error404.module.css";
import { useSelector } from "react-redux";

function Error404() {
  const nav = useNavigate();
  const member = useSelector(state => state.memberReducer);

  return (
    <>
      <div className={styles.error}>
        <div className={styles.notFound}>
          <div className={styles.notFound404}>
            <h3 className={styles.headingThird}>Oops! Page not found</h3>
            <h1 className={styles.headingFirst}>
              <span className={styles.span}>4</span>
              <span className={styles.span}>0</span>
              <span className={styles.span}>4</span>
            </h1>
          </div>
          <div>
            <h2 className={styles.headingSecond}>we are sorry, but the page you requested was not found</h2>
            <Button
              type="primary"
              style={{
                backgroundColor: "#00b14f",
              }}
              onClick={() => {
                switch (member.role) {
                  case "admin":
                    nav("/admin/dashboard");
                    break;
                  case "employer":
                    nav("/employer/posted-jobs");
                    break;
                  case "candidate":
                    nav("/candidate");
                    break;
                  default:
                    nav("/");
                    break;
                }
              }}
            >
              Về trang chính
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Error404;