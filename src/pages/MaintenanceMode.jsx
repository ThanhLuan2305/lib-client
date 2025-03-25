import React from "react";
import { Result, Typography } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { Container } from "react-bootstrap";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/maintenanceMode.css";

const { Title, Text } = Typography;

const MaintenanceMode = () => {
  const location = useLocation();

  const fromTime = location.state?.fromTime || null;

  return (
    <Container className="maintenance-container">
      <Result
        icon={<ToolOutlined style={{ fontSize: 64, color: "#1890ff" }} />}
        status="warning"
        title={<Title level={2}>System Under Maintenance</Title>}
        subTitle={
          <div>
            <Text>
              We are currently performing scheduled maintenance. Please try
              again later.
            </Text>
            {fromTime && (
              <Text block style={{ display: "block", marginTop: 16 }}>
                Maintenance started at:{" "}
                {dayjs(fromTime).format("DD-MM-YYYY HH:mm:ss")}
              </Text>
            )}
          </div>
        }
      />
    </Container>
  );
};

export default MaintenanceMode;
