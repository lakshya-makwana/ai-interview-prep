import { createContext, useContext, useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [dashboard, setDashboard] = useState({
    resume: null,
    analysis: null,
  });

  const [loading, setLoading] = useState(true);

  async function refreshDashboard() {
    try {
      setLoading(true);

      const data = await getDashboard();

      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    refreshDashboard();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        dashboard,
        loading,
        refreshDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}