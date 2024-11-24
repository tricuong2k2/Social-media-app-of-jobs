import Header from "../../components/Header/Header";
import styles from "./Home.module.css";
import { ConfigProvider } from "antd";
import axios from "axios";
import Footer from "../../components/FooterMain/Footer";
// import SearchJob from "../../components/Candidate/Search/SearchJob";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
function Home() {
  const nav = useNavigate();
  const member = useSelector(state => state.memberReducer);

  useEffect(() => {
    if (!member.role) {
      axios.post("http://localhost:8000/auth/navigation", {}, {
        withCredentials: true,
      })
        .then(res => {
          const role = res.data.info.role;
          switch (role) {
            case "admin":
              nav("/admin/dashboard");
              break;
            case "employer":
              nav("/employer/posted-jobs");
              break;
            default:
              nav("/candidate/");
              break;
          }
        })
        .catch(err => console.error(err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultHoverBg: "blue",
          },
          Select: {
            defaultActiveBg: "blue",
          },
        },
      }}
    >
      <div>
        <Header />
        <div className={styles.content}>
          <Outlet />
        </div>
        <div
          className={styles.footer_main}
          style={{
            width: "1150px",
            height: "170px",
            margin: "0 auto",
          }}
        >
          <Footer />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Home;