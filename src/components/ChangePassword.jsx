import React from "react";
import { Form, Input, Button, Typography, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { changePassword } from "../services/User";
import "../styles/changePassword.css";
import PropTypes from "prop-types";

const { Title } = Typography;

const ChangePassword = ({ userInfo, setUserInfo }) => {
  const [loading, setLoading] = React.useState(false);

  const handleChangePassword = async (values) => {
	setLoading(true);
	try {
	  await changePassword(values.oldPassword, values.newPassword, values.confirmPassword);
	  notification.success({
		message: "Password Changed",
		description: "Your password has been changed successfully!",
	  });
	} catch (error) {
	  console.log("Error in change password page: ", error);
	} finally {
	  setLoading(false);
	}
  };

  return (
    <div>
      <Title level={3} className="profile-title">
        Change Password
      </Title>
      <Form
        layout="vertical"
        onFinish={handleChangePassword}
        className="profile-form"
      >
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[
            { required: true, message: "Please enter your old password" },
            {
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must be at least 8 characters long and include letters, numbers, and special characters",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your old password"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter your new password" },
            {
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must be at least 8 characters long and include letters, numbers, and special characters",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your new password"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            {
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must be at least 8 characters long and include letters, numbers, and special characters",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm your new password"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          size="large"
        >
          Change Password
        </Button>
      </Form>
    </div>
  );
};

ChangePassword.propTypes = {
  userInfo: PropTypes.object,
  setUserInfo: PropTypes.func,
};

export default ChangePassword;
