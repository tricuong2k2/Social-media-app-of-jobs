import { Button, Layout } from "antd";
import { useState } from "react";
import { FaChartBar, FaUserShield, FaUserTie } from "react-icons/fa";
import { HiBuildingOffice2, HiUserGroup } from "react-icons/hi2";

import { FaCheckToSlot } from "react-icons/fa6";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { RiUserSearchFill } from "react-icons/ri";
import AdminSider from "../../components/Admin/AdminSider/AdminSider";

import styles from "./CompanyProfile.module.css";
import { Outlet } from "react-router-dom";

function CompanyProfile(){
    const [collapsed, setCollapsed] = useState(false);

  const itemsMenu = [
    
    {
      key: '3',
      icon: <HiBuildingOffice2 />,
      label: 'Danh sách công việc',
//      nav: '/admin/management/companies',
    },
    {
      key: '4',
      icon: <FaCheckToSlot />,
      label: 'Thông tin cá nhân',
//      nav: '/admin/management/posted-job',
    },
  ];
    return(
        <div className={styles.adminPage}>
        <Layout>
          <AdminSider items={itemsMenu} collapsed={collapsed} />
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
              <Button type="text"
                icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '18px',
                  height: '100%',
                  padding: "0 24px"
                }}
              />
            </Header> 
            <Content
            style={{
              // margin: "12px 8px 8px",
              padding: "16px",
              borderRadius: "8px",
              height: '75vh',
              overflowY: 'scroll',
              scrollbarWidth: 'none',
              float: 'left',
            }}
            >
            <Outlet />
            <div className="profile">
            <div className="profile-header" style={{float:'left', width: '200px', height:'200px', marginLeft:'30px'}}>
                <img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic"/>

            </div>
            <div className="profile-body" style={{float:'left'}}>
                <h1 className="profile-name">Le Tri Cuong</h1>
                <p className="profile-title">IT Intern</p>                
                <h2>About Me</h2>
                <p>Nothing</p>
                <h2>Skills</h2>
                <ul>
                    <li>JavaScript</li>
                    <li>React</li>
                    <li>Node.js</li>
                    <li>Expressjs</li>
                </ul>
            </div>
        </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 500,
              background: "#FFF",
            }}
          >
            © 2024. All Rights Reserved. PTIT Job Portal.
          </Footer>
        </Layout>
      </Layout>
    </div>      
    )
}
export default CompanyProfile;