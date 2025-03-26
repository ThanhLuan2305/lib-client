import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { getMaintenanceMode } from "./services/admin/MaintenanceMode";
import LoadingScreen from "./components/LoadingScreen";
import AppContent from "./components/AppContent";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchMaintenanceMode();
  }, []);

  const fetchMaintenanceMode = async () => {
    try {
      setLoading(true);
      const result = await getMaintenanceMode();
      setMaintenanceMode(result.maintenanceMode);
    } catch (error) {
      console.error("Error fetching maintenance mode:", error);
      setMaintenanceMode(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <AppContent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        maintenanceMode={maintenanceMode}
        pathname={location.pathname}
      />
    </AuthProvider>
  );
}

export default App;
