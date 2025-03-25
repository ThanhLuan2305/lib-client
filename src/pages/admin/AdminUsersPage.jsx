import React, { useState, useEffect, useContext } from "react";
import { Button, Pagination, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import UserTable from "../../components/UserTable";
import UserSearch from "../../components/UserSearch";
import UserModal from "../../components/UserModal";
import UserViewModal from "../../components/UserViewModal";
import { AuthContext } from "../../context/AuthContext";
import {
  getUsers,
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} from "../../services/admin/User";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    loadUsers();
  }, [page, searchCriteria]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let data;
      const hasCriteria = Object.values(searchCriteria).some((value) => value);
      if (hasCriteria) {
        data = await searchUsers(searchCriteria, page, pageSize);
      } else {
        data = await getUsers(page, pageSize);
      }
      setUsers(data.content);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("❌ Failed to load users:", error);
      if (error.message === "Session Expired") {
        logout();
      }
      setUsers([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
    setPage(1);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEdit(false);
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEdit(true);
    setModalVisible(true);
  };

  const handleViewUser = async (user) => {
    try {
      const userDetails = await getUser(user.id);
      setSelectedUser(userDetails);
      setViewModalVisible(true);
    } catch (error) {
      console.error("❌ Failed to fetch user details:", error);
      if (error.message === "Session Expired") {
        logout();
      }
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("❌ Failed to delete user:", error);
      if (error.message === "Session Expired") {
        logout();
      }
    }
  };

  const handleModalOk = async (values) => {
    try {
      if (isEdit) {
        await updateUser(selectedUser.id, values);
      } else {
        await createUser(values);
      }
      setModalVisible(false);
      loadUsers();
    } catch (error) {
      console.error("❌ Failed to save user:", error);
      if (error.message === "Session Expired") {
        logout();
      }
    }
  };

  return (
    <div className="admin-users-page">
      <h1>Manage Users</h1>
      <Space
        direction="vertical"
        style={{ width: "100%", marginBottom: "20px" }}
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
          Add User
        </Button>
        <UserSearch onSearch={handleSearch} />
      </Space>
      <UserTable
        users={users}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        loading={loading}
      />
      <Pagination
        current={page}
        pageSize={pageSize}
        total={totalElements}
        onChange={(newPage) => setPage(newPage)}
        style={{ marginTop: "20px", textAlign: "right" }}
      />
      <UserModal
        open={modalVisible} // Sử dụng open thay vì visible
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        initialValues={selectedUser}
        isEdit={isEdit}
      />
      <UserViewModal
        open={viewModalVisible} // Sử dụng open thay vì visible
        onCancel={() => setViewModalVisible(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default AdminUsersPage;
