import { useState, useContext, useEffect } from "react";
import { Input, Button, Form, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, role, loading: authLoading } = useContext(AuthContext);

  const renderIcon = (visible) =>
    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;

  useEffect(() => {
    if (role && !authLoading) {
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [role, authLoading, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    setError("");
    try {
      await login(values.email, values.password);
      notification.success({
        message: "Login Successful",
        description: "You have successfully logged in!",
      });
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      console.log("check loi trong login page: ", error.code);

      if (error.code === 1038) {
        navigate("/change-password-after-reset");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center bg-light pt-4">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "380px", width: "100%" }}
      >
        <h2 className="text-center mb-3 mt-4 fw-bold text-primary">Sign In</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
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
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                message:
                  "Password must contain letters, numbers, and special characters",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              size="large"
              iconRender={renderIcon}
            />
          </Form.Item>

          <div className="text-start mb-3">
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
            className="rounded-3 mt-3"
          >
            Login
          </Button>
          <p className="text-center mt-3">
            You don’t have an account yet, please{" "}
            <Link
              to="/register"
              className="text-decoration-none text-primary fw-semibold"
            >
              Sign Up
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
