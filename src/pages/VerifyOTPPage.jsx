import React, { useState, useEffect } from "react";
import { Form, Input, Button, notification, Steps } from "antd";
import {
  MailOutlined,
  SolutionOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { verifyPhone, verifyEmail } from "../services/Account";
import { useNavigate, useLocation } from "react-router-dom";
import OtpInput from "react-otp-input";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "../styles/verifyOTP.css";

const VerifyOTPPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromUrl = queryParams.get("email");
    const otpFromUrl = queryParams.get("otp");

    if (emailFromUrl && otpFromUrl) {
      // Tự động gọi verifyEmail khi có email và otp trong query params
      handleVerifyEmail(emailFromUrl, otpFromUrl);
    }
  }, [location]);

  const handleVerifyEmail = async (email, otp) => {
    try {
      await verifyEmail(otp, email);
      notification.success({
        message: "Email Verified",
        description: "Please proceed to phone verification",
      });
      setCurrentStep(1);
    } catch (error) {
      notification.error({
        message: "Verification Failed",
        description: error.response?.data?.message || "Invalid OTP",
      });
      setTimeout(() => navigate("/register"), 2000); // Quay lại trang đăng ký nếu thất bại
    }
  };

  const onFinish = async (values) => {
    try {
      if (currentStep === 1) {
        await verifyPhone(otp, values.phone);
        notification.success({
          message: "Verification Complete",
          description: "Your account is fully verified!",
        });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      notification.error({
        message: "Verification Failed",
        description: error.response?.data?.message || "Invalid OTP",
      });
    }
  };

  const steps = [
    {
      title: "Email",
      status: currentStep === 0 ? "process" : "finish",
      icon: <MailOutlined />,
    },
    {
      title: "Phone",
      status: currentStep === 0 ? "wait" : currentStep === 1 ? "process" : "finish",
      icon: <SolutionOutlined />,
    },
    {
      title: "Done",
      status: currentStep < 1 ? "wait" : "finish",
      icon: <SmileOutlined />,
    },
  ];

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="text-center mb-4">
          <h2 className="verify-title">Account Verification</h2>
          <p className="text-muted">Complete the steps to verify your account</p>
        </div>

        <Steps items={steps} className="mb-5" />

        <Form layout="vertical" onFinish={onFinish}>
          {currentStep === 0 ? (
            <p className="text-center">Verifying your email...</p>
          ) : (
            <>
              <Form.Item
                label={<span className="input-label">Phone Number</span>}
                name="phone"
                rules={[
                  { required: true, message: "Phone number is required" },
                  { pattern: /^\d{10}$/, message: "Must be 10 digits" },
                ]}
              >
                <Input
                  placeholder="Enter phone number"
                  size="large"
                  className="custom-input"
                />
              </Form.Item>
              <Form.Item label={<span className="input-label">Enter OTP</span>}>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => <input {...props} />}
                  inputStyle="otp-input"
                  containerStyle="otp-container"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="verify-button"
              >
                Verify
              </Button>
            </>
          )}

          <div className="text-center mt-3">
            <a href="/" className="resend-link">
              Resend OTP
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOTPPage;