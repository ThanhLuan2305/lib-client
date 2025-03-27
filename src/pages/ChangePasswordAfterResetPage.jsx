import React, { useState, useCallback } from "react";
import { Form, Input, Button, notification } from "antd";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import { changePasswordAfterReset } from "../services/Password";
import IconRenderer from "../components/IconRenderer";

const ChangePasswordAfterResetPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const renderIcon = useCallback(
    (visible) => <IconRenderer visible={visible} />,
    []
  );

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await changePasswordAfterReset(
        values.email,
        values.oldPassword,
        values.newPassword,
        values.confirmPassword
      );
      notification.success({
        message: "Password Changed",
        description: "Your password has been changed successfully!",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.log("Error in change password after reset page: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center bg-light pt-5">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "380px", width: "100%" }}
      >
        <h2 className="text-center mb-3 mt-4 fw-bold text-primary">
          Change Password
        </h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="fw-semibold">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="fw-semibold">Old Password</span>}
            name="oldPassword"
            rules={[
              { required: true, message: "Please enter your old password" },
            ]}
          >
            <Input.Password
              placeholder="Enter your old password"
              size="large"
              iconRender={renderIcon}
            />
          </Form.Item>

          <Form.Item
            label={<span className="fw-semibold">New Password</span>}
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
              iconRender={renderIcon}
            />
          </Form.Item>

          <Form.Item
            label={<span className="fw-semibold">Confirm New Password</span>}
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
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
              iconRender={renderIcon}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
            className="rounded-3 mt-4"
          >
            Change Password
          </Button>

          <p className="text-center mt-3">
            Back to{" "}
            <Link
              to="/login"
              className="text-decoration-none text-primary fw-semibold"
            >
              Sign In
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordAfterResetPage;
