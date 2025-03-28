import React, { useState } from "react";
import { Form, Input, Button, Typography, notification, Steps } from "antd";
import { changeEmail, verifyChangeEmail } from "../services/User";
import "../styles/changeEmail.css";
import PropTypes from "prop-types";

const { Title } = Typography;
const { Step } = Steps;

const ChangeEmail = ({ userInfo, setUserInfo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailForm] = Form.useForm(); // Form cho bước nhập email
  const [otpForm] = Form.useForm(); // Form cho bước nhập OTP

  const handleSendOtp = async (values) => {
    setLoading(true);
    try {
      await changeEmail(userInfo.email, values.email);
      setNewEmail(values.email);
      notification.success({
        message: "OTP Sent",
        description: `An OTP has been sent to ${values.email}.`,
      });
      setCurrentStep(1);
    } catch (error) {
      notification.error({
        message: "Send OTP Failed",
        description: error.message || "Failed to send OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xác thực OTP
  const handleVerifyOtp = async (values) => {
    setLoading(true);
    try {
      await verifyChangeEmail(userInfo.email, newEmail, values.otp);
      notification.success({
        message: "Email Changed",
        description: "Your email has been changed successfully!",
      });
      setUserInfo({ ...userInfo, email: newEmail });
      setCurrentStep(0);
      // Reset cả hai form sau khi đổi email thành công
      emailForm.resetFields();
      otpForm.resetFields();
    } catch (error) {
      notification.error({
        message: "Change Email Failed",
        description: error.message || "Failed to change email.",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Enter New Email",
      content: (
        <Form
          form={emailForm} // Gắn instance của form cho bước nhập email
          layout="vertical"
          onFinish={handleSendOtp}
          className="profile-form"
        >
          <Form.Item
            label="New Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your new email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter your new email" size="large" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
          >
            Send OTP
          </Button>
        </Form>
      ),
    },
    {
      title: "Verify OTP",
      content: (
        <Form
          form={otpForm} // Gắn instance của form cho bước nhập OTP
          layout="vertical"
          onFinish={handleVerifyOtp}
          className="profile-form"
        >
          <Form.Item
            label="OTP"
            name="otp"
            rules={[{ required: true, message: "Please enter the OTP" }]}
          >
            <Input placeholder="Enter the OTP" size="large" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
          >
            Verify OTP
          </Button>
        </Form>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} className="profile-title">
        Change Email
      </Title>
      <Steps current={currentStep} style={{ marginBottom: "20px" }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div>{steps[currentStep].content}</div>
    </div>
  );
};

ChangeEmail.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setUserInfo: PropTypes.func.isRequired,
};

export default ChangeEmail;
