import React, { useState } from "react";
import { Form, Input, Button, notification, Steps } from "antd";
import { MailOutlined, SmileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "../styles/forgetPassword.css";
import { requestPasswordReset } from "../services/Password";

const ForgotPasswordPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (values) => {
    setLoading(true);
    try {
      await requestPasswordReset(values.email);
      notification.success({
        message: "Request Sent",
        description: "Bạn hãy check email để đổi mật khẩu mới.",
      });
      setCurrentStep(1);
      setTimeout(() => navigate("/login"), 10000);
    } catch (error) {
      notification.error({
        message: "Request Failed",
        description: error.message || "Failed to send reset password request.",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Enter Email",
      status: currentStep === 0 ? "process" : "finish",
      icon: <MailOutlined />,
    },
    {
      title: "Done",
      status: currentStep === 1 ? "finish" : "wait",
      icon: <SmileOutlined />,
    },
  ];

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="text-center mb-4">
          <h2 className="verify-title">Forgot Password</h2>
          <p className="text-muted">Enter your email to reset your password</p>
        </div>

        <Steps items={steps} className="mb-5" />

        {currentStep === 0 && (
          <Form layout="vertical" onFinish={handleRequestReset}>
            <Form.Item
              label={<span className="input-label">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input
                placeholder="Enter your email"
                size="large"
                className="custom-input"
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
              Send Reset Link
            </Button>
          </Form>
        )}

        {currentStep === 1 && (
          <div className="text-center">
            <h4 className="text-success">Request Sent!</h4>
            <p className="text-muted">
             Please check your email to reset your password. You will be redirected to
              the login page in 10 seconds.
            </p>
            <Button
              type="primary"
              size="large"
              className="verify-button"
              onClick={() => navigate("/login")}
            >
              Go to Login Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
