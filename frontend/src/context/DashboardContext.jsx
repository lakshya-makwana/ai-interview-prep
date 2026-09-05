import { createContext, useContext, useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [dashboard, setDashboard] = useState({
    resume: null,
    analysis: null,
  });

  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

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
    if (!token) return undefined;

    let isMounted = true;
    getDashboard()
      .then((data) => {
        if (isMounted) setDashboard(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
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

// eslint-disable-next-line react-refresh/only-export-components
export function useDashboard() {
  return useContext(DashboardContext);
}