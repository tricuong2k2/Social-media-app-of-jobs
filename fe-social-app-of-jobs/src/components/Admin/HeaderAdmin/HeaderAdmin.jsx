import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Button, Dropdown, Space } from "antd";

import { AiOutlineLogout, AiOutlineMail, AiOutlineSetting, AiOutlineUser } from "react-icons/ai";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { PiBellRingingBold } from "react-icons/pi";
import { BiExitFullscreen, BiFullscreen } from "react-icons/bi";

import { logout } from "../../../actions";
import styles from "./HeaderAdmin.module.css";
import { useEffect, useState } from "react";

function HeaderAdmin({ collapsed, setCollapsed, admin, socket }) {
  const [fullScreen, setFullScreen] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    axios.get("http://localhost:8000/auth/logout", {
      withCredentials: true,
    })
      .then(_ => {
        socket.emit("leave");
        dispatch(logout());
        nav("/login");
      })
      .catch(err => {
        const code = err.response.status;
        if (code === 401 || code === 403)
          nav("/login");
      })
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

  return (
    <div className={styles.header}>
      <Button type="text"
        icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
        onClick={() => setCollapsed(!collapsed)}
        className={styles.btnCollapsed}
      />

      <div className={styles.actions}>
        <span className={styles.fullScreen}
          onClick={handleFullScreen}
        >{fullScreen ? <BiExitFullscreen /> : <BiFullscreen />}</span>
        <span className={styles.notifications}><PiBellRingingBold /></span>
        <Dropdown
          menu={{
            items: [
              // {
              //   key: "1",
              //   label: <Space align="center" className={styles.actionItem}>
              //     <span className={styles.actionIcon}><AiOutlineUser /></span> <span>Account</span>
              //   </Space>, 
              // },
              {
                key: "1",
                label: <Space align="center" className={styles.actionItem}>
                  <span className={styles.actionIcon}><AiOutlineMail /></span> <span>Inbox</span>
                </Space>, 
              },
              {
                key: "2",
                label: <Space align="center" className={styles.actionItem}>
                  <span className={styles.actionIcon}><AiOutlineSetting /></span> <span>Setting</span>
                </Space>,
              },
              {
                key: "3",
                label: <Space align="center" className={styles.actionItem}>
                  <span className={styles.actionIcon}><AiOutlineLogout /></span> <span>Logout</span>
                </Space>,
                onClick: handleLogout
              },
            ],
          }}
          trigger={['click']}
        >
          <button className={styles.adminAction}>
            <span className={styles.adminName}>{admin.fullName}</span>
            <Avatar
              src={admin.avatar}
              icon={admin.avatar ? null : <AiOutlineUser />}
            />
          </button>
        </Dropdown>
      </div>
    </div>
  );
}

export default HeaderAdmin;