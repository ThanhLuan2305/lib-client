import { useState } from "react";
import { Input, Button, Form, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { login } from "../services/Authentication";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      notification.success({
        message: "Login Successful",
        description: "You have successfully logged in!",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center bg-light bg-light pt-5">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "380px", width: "100%", height: "55vh" }}
      >
        <h2 className="text-center mb-3 mt-4 fw-bold text-primary">Sign In</h2>
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
            <Input.Password
              placeholder="Enter your password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link
              to="/forgot-password"
              className="text-decoration-none text-primary fw-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
            className="rounded-3 mt-4"
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
