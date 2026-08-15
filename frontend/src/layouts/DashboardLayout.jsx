import { Box } from "@mui/material";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#0B1120",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar />

        <Box
          component="main"
          sx={{
            flex: 1,
            width: "100%",
            maxWidth: 1600,
            mx: "auto",
            px: 4,
            py: 4,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}