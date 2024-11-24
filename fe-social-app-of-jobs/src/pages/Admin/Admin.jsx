import { ConfigProvider, FloatButton, Layout, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { FaChartBar, FaUserCircle, FaUserShield, FaUserTie } from "react-icons/fa";
import { HiBuildingOffice2, HiUserGroup } from "react-icons/hi2";
import { LoadingOutlined } from '@ant-design/icons';

import { FaCheckToSlot } from "react-icons/fa6";
import { Content, Header } from "antd/es/layout/layout";
import { IoChatboxEllipsesSharp } from "react-icons/io5";

import { RiFunctionLine, RiUserSearchFill } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import { TbSettingsCode } from "react-icons/tb";
import AdminSider from "../../components/Admin/AdminSider/AdminSider";
import HeaderAdmin from "../../components/Admin/HeaderAdmin/HeaderAdmin";

import { setAdminInfo } from "../../actions";

import axios from "axios";

import styles from "./Admin.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const primaryColor = "#00b14f";

function Admin({ socket }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const admin = useSelector(state => state.memberReducer);
  const dispatch = useDispatch();

  const contentRef = useRef(null);

  const nav = useNavigate();

  const itemsMenu = [
    {
      key: "features",
      label: (<strong style={{ display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "start" } }>
          {collapsed ? null : <RiFunctionLine />} <span style={collapsed ? null : { marginLeft: "4px" }}>FEATURES</span>
        </strong>),
      type: "group",
      children: [
        {
          key: '1',
          icon: <FaChartBar />,
          label: 'Dashboard',
          nav: '/admin/dashboard',
        },
        {
          key: '2',
          icon: <HiUserGroup />,
          label: 'List of members',
          children: [
            {
              key: '2.1',
              icon: <FaUserTie />,
              label: 'Candidates',
              nav: '/admin/management/candidates',
            },
            {
              key: '2.2',
              icon: <RiUserSearchFill />,
              label: 'Employers',
              nav: '/admin/management/employers',
            },
            {
              key: '2.3',
              icon: <FaUserShield />,
              label: 'Admins',
              nav: '/admin/management/admins',
            }
          ]
        },
        {
          key: '3',
          icon: <HiBuildingOffice2 />,
          label: 'List of companies',
          nav: '/admin/management/companies',
        },
        {
          key: '4',
          icon: <FaCheckToSlot />,
          label: 'List of posted jobs',
          nav: '/admin/management/posted-job',
        },
      ]
    },
    {  type: "divider" }, 
    {
      key: "admin",
      label: (<strong style={{ display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "start" }}>
          {collapsed ? null : <TbSettingsCode />} <span style={collapsed ? null : { marginLeft: "4px" }}>ADMIN</span>
        </strong>),
      type: "group",
      children: [
        {
          key: "5",
          icon: <FaUserCircle />,
          label: "Account",
          nav: "/admin/account"
        },
        {
          key: "6",
          icon: <IoChatboxEllipsesSharp />,
          label: "Chat",
          nav: "/admin/chat"
        },
        {
          key: "7",
          icon: <FaHistory />,
          label: "History",
          nav: "/admin/history"
        },
      ],
    }
  ];

  const getOverviewInfo = async () => {
    try {
      const [resOverview, resInfo] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/overview", {
          withCredentials: true,
        }),
        axios.get("http://localhost:8000/api/admin/info", {
          withCredentials: true,
        })
      ]);

      setLoading(false);
      setData(resOverview.data);
      dispatch(setAdminInfo(resInfo.data.info));
      // if (!admin)
      //   localStorage.setItem("selected-key", 1);
      return resInfo.data.info;
    } catch (error) {
      console.log(error);
      const code = error.response.status;
      console.log(code);
      if (400 <= code && code < 500)
        nav("/login");
    }
  }

  useEffect(() => {
    getOverviewInfo()
      .then(admin => socket.emit("online", admin?._id));
    
    return () => {
      localStorage.removeItem("selected-key");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.adminPage}>
      {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: "#00b14f" }} spin />} fullscreen /> : (
        <Layout>
          <AdminSider items={itemsMenu} collapsed={collapsed} admin={admin} />
          <ConfigProvider
            theme={{
              components: {
                // Layout: {
                //   bodyBg: "#00b14f0a",
                // },
                FloatButton: {
                  colorText: primaryColor,
                }
              }
            }}
          >
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
                  admin={admin}
                  socket={socket}
                />
              </Header>
              <Content
                ref={contentRef}
                style={{
                  // margin: "12px 8px 8px",
                  padding: "16px",
                  borderRadius: "8px",
                  height: '100vh',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                }}
              >
                <FloatButton.BackTop target={() => contentRef.current} />
                <Outlet context={{ data, admin, getOverviewInfo }} />
              </Content>
              {/* <Footer
            style={{
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 500,
              background: "#FFF",
            }}
          >
            © 2024. All Rights Reserved. PTIT Job Portal.
          </Footer> */}
            </Layout>
          </ConfigProvider>
        </Layout>
      )}
    </div>
  );
}

export default Admin;