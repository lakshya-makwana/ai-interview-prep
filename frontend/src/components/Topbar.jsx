import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";

const pageTitles = {
  "/": "Dashboard",
  "/profile": "User Profile",
  "/resume": "Resume",
  "/analysis": "AI Analysis",
};

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const dashboardContext = useDashboard();
  
  const dashboard = dashboardContext?.dashboard ?? {
    resume: null,
    analysis: null,
  };

  const atsScore = dashboard.analysis ? `${dashboard.analysis.ats_score}%` : "Not analyzed";
  const title = pageTitles[location.pathname] || "AI Interview";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: "background.default",
        borderBottom: 1,
        borderColor: "divider",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          <IconButton
            onClick={onMenuClick}
            sx={{ display: { xs: "inline-flex", lg: "none" } }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" noWrap>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              AI resume analysis and interview preparation workspace.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
          <Chip
            icon={<PsychologyRoundedIcon />}
            label={`ATS: ${atsScore}`}
            color={dashboard.analysis ? "primary" : "default"}
            variant={dashboard.analysis ? "filled" : "outlined"}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          />

          <Tooltip title="User Profile">
            <IconButton
              onClick={() => navigate("/profile")}
              sx={{ p: 0 }}
            >
              <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
                <PersonRoundedIcon />
              </Avatar>
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
