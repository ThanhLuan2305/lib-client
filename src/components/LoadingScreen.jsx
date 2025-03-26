import React from "react";
import { Spin, Layout } from "antd";

const LoadingScreen = () => (
  <Layout
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f0f2f5",
    }}
  >
    <Spin size="large" />
  </Layout>
);

export default LoadingScreen;