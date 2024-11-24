import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, ConfigProvider, Dropdown, Menu, Space } from "antd";

import { AiOutlineLogout, AiOutlineMail, AiOutlineSetting, AiOutlineUser } from "react-icons/ai";
import { FaCheckToSlot, FaEyeSlash } from "react-icons/fa6";
import { IoMdChatbubbles } from "react-icons/io";
import { FaClipboardList } from "react-icons/fa";
import { PiBellRingingBold } from "react-icons/pi";
import { ImProfile } from "react-icons/im";
import { BiExitFullscreen, BiFullscreen } from "react-icons/bi";

import { logout } from "../../../actions";
import styles from "./Header.module.css";
import { useEffect, useState } from "react";

const primaryColor = "#00b14f";
const bgBlur = "#00b14f0a";

function Header({ collapsed, setCollapsed, employer }) {
  const [fullScreen, setFullScreen] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();
  // const [selectedKeys, setSelectedKeys] = useState(["1.1"]);

  const handleLogout = () => {
    axios.get("http://localhost:8000/auth/logout", {
      withCredentials: true,
    })
      .then(_ => {
        dispatch(logout());
        nav("/login");
      })
  }

  const handleAccount = () => {

    nav("/employer/employer-profile");
  }

  const handleFullScreen = () => {
    if (fullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    } else {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    }
  }

  useEffect(() => {
    document.onfullscreenchange = () => {
      if (document.fullscreenElement)
        setFullScreen(true);
      else
        setFullScreen(false);
    }

    return document.removeEventListener("fullscreenchange", document);
  }, []);

  const itemsMenu = [
    {
      key: "1",
      label: <span className={styles.lbMenu}>Jobs</span>,
      // nav: "/employer/posted-jobs",
      icon: <FaClipboardList />,
      children: [
        {
          label: <span className={styles.lbchildMenu}>Active Jobs</span>,
          key: "1.1",
          icon: <FaCheckToSlot />,
          nav: "/employer/posted-jobs?hidden=false",
        },
        {
          label: <span className={styles.lbchildMenu}>Hidden Jobs</span>,
          key: "1.2",
          icon: <FaEyeSlash />,
          nav: "/employer/posted-jobs?hidden=true"
        },
      ],
    },
    {
      key: "2",
      label: <span className={styles.lbMenu}>Company Profile</span>,
      nav: "/employer/company-profile",
      icon: <ImProfile />
    },
    // {
    //   key: "3",
    //   label: <span className={styles.lbMenu}>Post</span>,
    //   nav: "/employer/post-job",
    //   icon: <RiUserSearchFill />
    // },
    {
      key: "4",
      label: <span className={styles.lbMenu}>Chat</span>,
      nav: "/employer/chat",
      icon: <IoMdChatbubbles />
    },
  ];

  return (
    <div className={styles.header}>
      {/* <Button type="text"
          icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
          onClick={() => setCollapsed(!collapsed)}
          className={styles.btnCollapsed}
        /> */}
      <div className={styles.navBar}>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                horizontalItemHoverColor: "#04df67",
                itemSelectedColor: primaryColor,
                itemColor: "#6c757d",
                itemHoverColor: "#04df67",
                horizontalItemSelectedColor: primaryColor,
                itemActiveBg: bgBlur,
                colorPrimaryBorder: "#04df67",
              }
            }
          }}
        >
          <Menu
            mode="horizontal"
            items={itemsMenu}
            defaultSelectedKeys={["1.1"]}
            onClick={(item) => {
              // setSelectedKeys([item.item.props.key]);
              nav(item.item.props.nav);
            }}
            // selectedKeys={selectedKeys}
          />
        </ConfigProvider>
      </div>

      {/* <div className={styles.navMenu}>
          {itemsMenu.map(item => (
            <Button
              key={item.key}
              onClick={() => nav(item.nav)}
              className={styles.navButton}
            >
              {item.label}
            </Button>
          ))}
        </div> */}

      <div className={styles.actions}>
        <span className={styles.fullScreen}
          onClick={handleFullScreen}
        >{fullScreen ? <BiExitFullscreen /> : <BiFullscreen />}</span>
        <span className={styles.notifications}><PiBellRingingBold /></span>
        <Dropdown
          menu={{
            items: [
              {
                label: <Space align="center" className={styles.actionItem}>
                  <span className={styles.actionIcon}><AiOutlineUser /></span> <span>Account</span>
                </Space>, key: "1",
                onClick: handleAccount
              },
              {
                label: <Space align="center" className={styles.actionItem}>
                  <span className={styles.actionIcon}><AiOutlineMail /></span> <span>Inbox</span>
                </Space>, key: "2"
              },
              {
                label: <Space align="center" className={styles.actionItem}>
                  <span className={styles.actionIcon}><AiOutlineSetting /></span> <span>Setting</span>
                </Space>, key: "3"
              },
              {
                key: "4",
                label: <Space align="center" className={styles.actionItem}>
                  <span className={styles.actionIcon}><AiOutlineLogout /></span> <span>Logout</span>
                </Space>,
                onClick: handleLogout
              },
            ],
          }}
          trigger={['click']}
        >
          <button className={styles.employerAction}>
            <span className={styles.employerName}>{employer.fullName}</span>
            <Avatar
              src={employer.avatar}
              icon={employer.avatar ? null : <AiOutlineUser />}
            />
          </button>
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;