import React, { useState, useEffect } from "react";
import { Form, Input, Button, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "../styles/resetPassword.css";
import { resetPassword } from "../services/Password";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const token = searchParams.get("token"); // Lấy token từ URL

  useEffect(() => {
    if (!token) {
      notification.error({
        message: "Invalid Link",
        description: "The reset password link is invalid or has expired.",
      });
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await resetPassword(token, values.newPassword, values.confirmPassword);
      notification.success({
        message: "Password Reset Successful",
        description:
          "Your password has been reset successfully! You can now log in with your new password.",
      });
      form.resetFields();
      setTimeout(() => navigate("/login"), 3000); 
    } catch (error) {
      notification.error({
        message: "Reset Password Failed",
        description: error.message || "Failed to reset your password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="text-center mb-4">
          <h2 className="verify-title">Reset Password</h2>
          <p className="text-muted">Enter your new password below</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleResetPassword}
          className="profile-form"
        >
          <Form.Item
            label={<span className="input-label">New Password</span>}
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password" },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                message:
                  "Password must be at least 8 characters long and include letters, numbers, and special characters (@$!%*?&#)",
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
            label={<span className="input-label">Confirm New Password</span>}
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                message:
                  "Password must be at least 8 characters long and include letters, numbers, and special characters (@$!%*?&#)",
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
            size="large"
            className="verify-button"
            loading={loading}
          >
            Reset Password
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
