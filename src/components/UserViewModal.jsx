import React from "react";
import PropTypes from "prop-types";
import { Modal, Descriptions, Tag } from "antd";
import dayjs from "dayjs";
import "../styles/userViewModal.css";

const UserViewModal = ({ open, onCancel, user }) => {
  if (!user) return null;

  return (
    <Modal
      className="user-view-modal"
      title="User Details"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
        <Descriptions.Item label="Full Name">{user.fullName}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {user.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Birth Date">
          {user.birthDate ? dayjs(user.birthDate).format("DD/MM/YYYY") : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Verification Status">
          <Tag color={user.verificationStatus === "FULLY_VERIFIED" ? "green" : "red"}>
            {user.verificationStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Roles">
          {user.roles
            ? user.roles.map((role) => (
                <Tag
                  key={role.name}
                  color={role.name === "ADMIN" ? "blue" : "default"}
                >
                  {role.name}
                </Tag>
              ))
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Deleted">
          <Tag color={user.deleted ? "red" : "green"}>
            {user.deleted ? "Yes" : "No"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Reset Password">
          <Tag color={user.resetPassword ? "orange" : "green"}>
            {user.resetPassword ? "Yes" : "No"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Late Return Count">
          {user.lateReturnCount || 0}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {user.createdAt
            ? dayjs(user.createdAt).format("DD/MM/YYYY HH:mm:ss")
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {user.updatedAt
            ? dayjs(user.updatedAt).format("DD/MM/YYYY HH:mm:ss")
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">
          {user.createdBy || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated By">
          {user.updatedBy || "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

UserViewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default UserViewModal;
