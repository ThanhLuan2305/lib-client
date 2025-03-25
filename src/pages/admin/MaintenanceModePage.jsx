import React, { useState, useEffect } from "react";
import { Card, Switch, Typography, Spin, message } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  setMaintenanceMode as apiSetMaintenceMode,
  getMaintenanceMode,
} from "../../services/admin/MaintenanceMode";
import "../../styles/maintenanceModePage.css";

const { Title, Text } = Typography;

const MaintenanceModePage = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [fromTime, setFromTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "The system is running normally."
  );

  // Lấy trạng thái chế độ bảo trì khi component được mount
  useEffect(() => {
    fetchMaintenanceMode();
  }, []);

  const fetchMaintenanceMode = async () => {
    setLoading(true);
    try {
      const result = await getMaintenanceMode();
      setMaintenanceMode(result.maintenanceMode);
      setFromTime(result.from);
      setStatusMessage(
        result.maintenanceMode
          ? "The system is currently under maintenance."
          : "The system is running normally."
      );
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMaintenance = async (checked) => {
    setLoading(true);
    try {
      await apiSetMaintenceMode(checked);
      message.success(
        `Maintenance mode ${checked ? "enabled" : "disabled"} successfully`
      );
      setMaintenanceMode(checked);
      setFromTime(checked ? dayjs().toISOString() : null);
      setStatusMessage(
        checked
          ? "The system is currently under maintenance."
          : "The system is running normally."
      );
    } catch (error) {
      message.error(error.message);
      // Nếu thất bại, giữ nguyên trạng thái cũ
      setMaintenanceMode(!checked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="maintenance-mode-page">
      <Title level={2} className="maintenance-mode-title">
        Maintenance Mode Settings
      </Title>
      <Spin spinning={loading} size="large">
        <Card
          className={`maintenance-card ${
            maintenanceMode ? "maintenance-on" : "maintenance-off"
          }`}
        >
          <div className="maintenance-content">
            <div className="status-icon">
              {maintenanceMode ? (
                <ExclamationCircleOutlined className="icon-on" />
              ) : (
                <CheckCircleOutlined className="icon-off" />
              )}
            </div>
            <div className="status-details">
              <Text
                strong
                className={
                  maintenanceMode ? "status-text-on" : "status-text-off"
                }
              >
                {statusMessage}
              </Text>
              {maintenanceMode && fromTime && (
                <Text className="status-time">
                  Since: {dayjs(fromTime).format("DD-MM-YYYY HH:mm:ss")}
                </Text>
              )}
            </div>
            <div className="toggle-switch">
              <Switch
                checked={maintenanceMode}
                onChange={handleToggleMaintenance}
                loading={loading}
                checkedChildren="ON"
                unCheckedChildren="OFF"
                className={maintenanceMode ? "switch-on" : "switch-off"}
              />
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default MaintenanceModePage;
