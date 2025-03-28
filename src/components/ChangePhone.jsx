import React, { useState } from "react";
import { Form, Input, Button, Typography, notification, Steps } from "antd";
import "../styles/changePhone.css";
import { changePhone, verifyChangePhone } from "../services/User";
import PropTypes from "prop-types";

const { Title } = Typography;
const { Step } = Steps;

const ChangePhone = ({ userInfo, setUserInfo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneForm] = Form.useForm(); // Form cho bước nhập số điện thoại
  const [otpForm] = Form.useForm(); // Form cho bước nhập OTP

  // Giả lập API gửi OTP
  const handleSendOtp = async (values) => {
    setLoading(true);
    try {
      await changePhone(userInfo.phoneNumber, values.phoneNumber);
      setNewPhone(values.phoneNumber);
      notification.success({
        message: "OTP Sent",
        description: `An OTP has been sent to ${values.phoneNumber}.`,
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

  const handleVerifyOtp = async (values) => {
    setLoading(true);
    try {
      await verifyChangePhone(userInfo.phoneNumber, newPhone, values.otp);
      notification.success({
        message: "Phone Number Changed",
        description: "Your phone number has been changed successfully!",
      });
      setUserInfo({ ...userInfo, phoneNumber: newPhone });
      setCurrentStep(0);
      phoneForm.resetFields();
      otpForm.resetFields();
    } catch (error) {
      notification.error({
        message: "Change Phone Failed",
        description: error.message || "Failed to change phone number.",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Enter New Phone Number",
      content: (
        <Form
          form={phoneForm} // Gắn instance của form cho bước nhập số điện thoại
          layout="vertical"
          onFinish={handleSendOtp}
          className="profile-form"
        >
          <Form.Item
            label="New Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter your new phone number" },
              {
                pattern: /^\d{10,}$/,
                message: "Phone number must be at least 10 digits",
              },
            ]}
          >
            <Input placeholder="Enter your new phone number" size="large" />
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
          form={otpForm}
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
        Change Phone Number
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

ChangePhone.propTypes = {
  userInfo: PropTypes.object,
  setUserInfo: PropTypes.func,
};

export default ChangePhone;
