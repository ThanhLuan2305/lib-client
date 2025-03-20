import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Typography, Card, notification } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "../styles/profilePage.css";
import { getInfo } from "../services/User";
import UserInfo from "../components/UserInfo";
import ChangePassword from "../components/ChangePassword";
import ChangeEmail from "../components/ChangeEmail";
import ChangePhone from "../components/ChangePhone";

const { Sider, Content } = Layout;
const { Title } = Typography;

const ProfilePage = () => {
  const [selectedMenu, setSelectedMenu] = useState("info");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getInfo();
        setUserInfo(data);
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Failed to load user information.",
        });
      }
    };
    fetchUserInfo();
  }, []);

  const menuItems = [
    { key: "info", icon: <UserOutlined />, label: "Info" },
    { key: "change-password", icon: <LockOutlined />, label: "Change Password" },
    { key: "change-email", icon: <MailOutlined />, label: "Change Email" },
    { key: "change-phone", icon: <PhoneOutlined />, label: "Change Phone" },
  ];

  return (
    <Layout className="profile-layout">
      {/* Sidebar bên trái */}
      <Sider width={220} className="profile-sider">
        <div className="profile-header">
          <Avatar size={100} className="profile-avatar">
            {userInfo?.fullName ? userInfo.fullName[0].toUpperCase() : "U"}
          </Avatar>
          <Title level={4} className="profile-username">
            {userInfo?.fullName || "User"}
          </Title>
        </div>
        <div className="profile-menu">
          <Menu
            mode="vertical"
            selectedKeys={[selectedMenu]}
            onClick={(e) => setSelectedMenu(e.key)}
            items={menuItems}
          />
        </div>
      </Sider>

      {/* Nội dung bên phải */}
      <Content className="profile-content">
        <Card className="profile-card">
          {selectedMenu === "info" && <UserInfo userInfo={userInfo} />}
          {selectedMenu === "change-password" && (
            <ChangePassword userInfo={userInfo} setUserInfo={setUserInfo} />
          )}
          {selectedMenu === "change-email" && (
            <ChangeEmail userInfo={userInfo} setUserInfo={setUserInfo} />
          )}
          {selectedMenu === "change-phone" && (
            <ChangePhone userInfo={userInfo} setUserInfo={setUserInfo} />
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default ProfilePage;