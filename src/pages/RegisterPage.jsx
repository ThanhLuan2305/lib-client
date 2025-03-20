import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, DatePicker, message, notification } from "antd";
import moment from "moment";
import { register } from "../services/Account";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        birthDate: values.birthDate.format("DD-MM-YYYY[T]17:00:00.000[Z]"),
      };
      await register(
        formattedValues.email,
        formattedValues.phoneNumber,
        formattedValues.password,
        formattedValues.fullName,
        formattedValues.birthDate
      );
      notification.success({
        message: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      message.error(error.response?.data?.message || "Registration failed!");
    }
    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center bg-light pt-4">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <h2 className="text-center mb-3 mt-2 fw-bold text-primary">Sign Up</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="fw-semibold">Full Name</span>}
            name="fullName"
            rules={[
              { required: true, message: "Please enter your full name" },
              { max: 255, message: "Full name cannot exceed 255 characters" },
            ]}
          >
            <Input placeholder="Enter full name" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="fw-semibold">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="fw-semibold">Phone Number</span>}
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: /^\d{10}$/,
                message: "Phone number must be 10 digits",
              },
            ]}
          >
            <Input placeholder="Enter phone number" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="fw-semibold">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain letters, numbers, and special characters",
              },
            ]}
          >
            <Input.Password placeholder="Enter password" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="fw-semibold">Date of Birth</span>}
            name="birthDate"
            rules={[
              { required: true, message: "Please select your date of birth" },
              () => ({
                validator(_, value) {
                  if (!value || moment(value).isBefore(moment())) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Date of birth must be in the past")
                  );
                },
              }),
            ]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Select birth date"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
            className="rounded-3 mt-3"
          >
            Register
          </Button>
          <p className="text-center mt-3">
            Already have an account?{" "}
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

export default RegisterPage;
