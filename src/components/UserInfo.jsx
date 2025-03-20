import React from "react";
import { Typography } from "antd";
import moment from "moment";
import "../styles/userInfo.css";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const UserInfo = ({ userInfo }) => {
  return (
    <div>
      <Title level={3} className="profile-title">
        User Information
      </Title>
      {userInfo ? (
        <div className="info-section">
          <Text strong>Email</Text>
          <Text>{userInfo.email}</Text>
          <Text strong>Phone Number</Text>
          <Text>{userInfo.phoneNumber}</Text>
          <Text strong>Full Name</Text>
          <Text>{userInfo.fullName}</Text>
          <Text strong>Birth Date</Text>
          <Text>{moment(userInfo.birthDate).format("DD/MM/YYYY")}</Text>
          <Text strong>Verification Status</Text>
          <Text>{userInfo.verificationStatus}</Text>
          <Text strong>Late Return Count</Text>
          <Text>{userInfo.lateReturnCount}</Text>
          <Text strong>Roles</Text>
          <Text>{userInfo.roles.map((role) => role.name).join(", ")}</Text>
          <Text strong>Created At</Text>
          <Text>
            {moment(userInfo.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </Text>
          <Text strong>Updated At</Text>
          <Text>
            {moment(userInfo.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
          </Text>
        </div>
      ) : (
        <Text>Loading...</Text>
      )}
    </div>
  );
};

UserInfo.propTypes = { userInfo: PropTypes.object };

export default UserInfo;
