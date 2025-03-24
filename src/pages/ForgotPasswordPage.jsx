import React, { useState } from "react";
import { Form, Input, Button, notification, Checkbox, Steps } from "antd";
import {
  MailOutlined,
  SolutionOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "../styles/forgetPassword.css";
import { requestPasswordReset, resetPassword } from "../services/Password";

const ForgotPasswordPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleRequestOtp = async (values) => {
    setLoading(true);
    try {
      setContactInfo(values.contactInfo);
      setIsPhone(values.isPhone || false);
      const rs = await requestPasswordReset(
        values.contactInfo,
        values.isPhone || false
      );
      console.log(rs);
      notification.success({
        message: "OTP Sent",
        description: "An OTP has been sent to your contact info.",
      });
      setCurrentStep(1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await resetPassword(otp, contactInfo, isPhone);
      const newPasswordFromApi = response.result;
      setNewPassword(newPasswordFromApi);
      notification.success({
        message: "Password Reset Successful",
        description: "Your password has been reset successfully!",
      });
      setCurrentStep(2);
      setTimeout(() => navigate("/login"), 360000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getStatus = (currentStep) => {
    if (currentStep === 0) {
      return "wait";
    }
    if (currentStep === 1) {
      return "process";
    }
    return "finish";
  };
  const steps = [
    {
      title: "Request OTP",
      status: currentStep === 0 ? "process" : "finish",
      icon: <MailOutlined />,
    },
    {
      title: "Verify OTP",
      status: getStatus(currentStep),
      icon: <SolutionOutlined />,
    },
    {
      title: "Done",
      status: currentStep < 2 ? "wait" : "finish",
      icon: <SmileOutlined />,
    },
  ];

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="text-center mb-4">
          <h2 className="verify-title">Reset Password</h2>
          <p className="text-muted">
            Complete the steps to reset your password
          </p>
        </div>

        <Steps items={steps} className="mb-5" />

        {currentStep === 0 && (
          <Form layout="vertical" onFinish={handleRequestOtp}>
            <Form.Item
              label={
                <span className="input-label">Contact Info (Email/Phone)</span>
              }
              name="contactInfo"
              rules={[
                {
                  required: true,
                  message: "Please enter your email or phone number",
                },
              ]}
            >
              <Input
                placeholder="Enter your email or phone number"
                size="large"
                className="custom-input"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="input-label">Is this a phone number?</span>
              }
              name="isPhone"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="verify-button"
              loading={loading}
            >
              Send OTP
            </Button>
          </Form>
        )}

        {currentStep === 1 && (
          <div>
            <div className="text-center mb-4">
              <p className="text-muted">
                An OTP has been sent to {contactInfo}. Please enter it below.
              </p>
            </div>
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
              block
              size="large"
              className="verify-button"
              onClick={handleVerifyOtp}
              loading={loading}
            >
              Verify OTP
            </Button>
            <div className="text-center mt-3">
              <a
                href="/"
                className="resend-link"
                onClick={() => handleRequestOtp({ contactInfo, isPhone })}
              >
                Resend OTP
              </a>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center">
            <h4 className="text-success">Password Reset Complete!</h4>
            <p className="text-muted">
              Your new password is: <strong>{newPassword}</strong>
            </p>
            <p className="text-muted">
              Please use this password to log in. You will be redirected to the
              login page in 2 minutes.
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
