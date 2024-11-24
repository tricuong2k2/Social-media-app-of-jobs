import { Layout } from "antd";
import { useEffect, useState } from "react";
import { Content, Header } from "antd/es/layout/layout";

// import AdminSider from "../../components/Admin/AdminSider/AdminSider";
import HeaderAdmin from "../../components/Employer/Header/Header";

import { setEmployerInfo } from "../../actions";

import axios from "axios";

import styles from "./Employer.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Employer() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const employer = useSelector(state => state.memberReducer);
  const dispatch = useDispatch();

  const nav = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/employer/info/", {
      withCredentials: true,
    })
      .then(res => {
        const info = res.data.info;
        dispatch(setEmployerInfo({
          companyId: info.company,
          uid: info._id,
          ...info.member,
        }))
        nav("/employer/posted-jobs");
      })
      .catch(err => {
        console.error(err);

        const code = err?.response?.status;
        if (400 <= code && code < 500)
          nav("/login");
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.adminPage}>
        <Layout>
        {/* <AdminSider collapsed={collapsed} /> */}
        <Layout
          style={{
            maxHeight: '100vh',
          }}
        >
          <Header
            style={{
              padding: 0,
              backgroundColor: "#FFF",
            }}
          >
            <HeaderAdmin
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              employer={employer}
            />
          </Header>
          <Content
            style={{
              padding: "16px",
              borderRadius: "8px",
              height: '100vh',
              overflowY: 'scroll',
              scrollbarWidth: 'none',
            }}
          >
            <Outlet context={{ data }} />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default Employer;
