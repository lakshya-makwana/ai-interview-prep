import { useState } from "react";

import { Box } from "@mui/material";

import Sidebar, { drawerWidth } from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 2.5 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1280 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
