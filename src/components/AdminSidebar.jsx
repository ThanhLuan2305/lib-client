import React from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  HistoryOutlined,
  SettingOutlined,
  MessageOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import "../styles/adminSidebar.css";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <h2>Menu</h2>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
        </Menu.Item>
        <Menu.Item key="manage-user" icon={<UserOutlined />}>
          <NavLink to="/admin/users">Manage User</NavLink>
        </Menu.Item>
        <Menu.Item key="manage-book" icon={<BookOutlined />}>
          <NavLink to="/admin/books">Manage Book</NavLink>
        </Menu.Item>
        <Menu.Item key="manage-topic" icon={<CommentOutlined />}>
          <NavLink to="/admin/topics">Manage Topic</NavLink>
        </Menu.Item>
        <Menu.Item key="activity-log" icon={<HistoryOutlined />}>
          <NavLink to="/admin/activity-log">Activity Log</NavLink>
        </Menu.Item>
        <Menu.Item key="maintenance-mode" icon={<SettingOutlined />}>
          <NavLink to="/admin/maintenance-mode">Maintenance Mode</NavLink>
        </Menu.Item>
        <Menu.Item key="chat-with-users" icon={<MessageOutlined />}>
          <NavLink to="/admin/chat">Chat with Users</NavLink>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AdminSidebar;
