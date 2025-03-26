import React, { useEffect, useState  } from "react";
import { Result, Typography } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getMaintenanceMode } from "../services/admin/MaintenanceMode";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/maintenanceMode.css";

const { Title, Text } = Typography;

const MaintenanceMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fromTime = location.state?.fromTime || null;

  useEffect(() => {
    const fetchMaintenanceMode = async () => {
      try {
        setLoading(true);
        const result = await getMaintenanceMode();
        if (!result.maintenanceMode) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching maintenance mode:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceMode();

    const interval = setInterval(fetchMaintenanceMode, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) {
    return (
      <Container className="maintenance-container">
        <Result
          icon={<ToolOutlined style={{ fontSize: 64, color: "#1890ff" }} />}
          title={<Title level={2}>Checking Maintenance Status...</Title>}
        />
      </Container>
    );
  }

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
