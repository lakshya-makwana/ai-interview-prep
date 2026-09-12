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

const pageMetadata = {
  "/": {
    title: "Dashboard",
    subtitle: "AI resume analysis and interview preparation workspace.",
  },
  "/profile": {
    title: "User Profile",
    subtitle: "Manage your account and resume status.",
  },
  "/resume": {
    title: "Resume",
    subtitle: "Upload and manage your resume for AI ATS optimization.",
  },
  "/analysis": {
    title: "AI Analysis",
    subtitle: "In-depth resume evaluation and tailored preparation feedback.",
  },
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

  let meta = pageMetadata[location.pathname] || {
    title: "AI Interview",
    subtitle: "Preparation workspace.",
  };

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
            aria-label="Open navigation menu"
            sx={{ display: { xs: "inline-flex", lg: "none" } }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" noWrap>
              {meta.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {meta.subtitle}
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
              aria-label="User Profile"
              sx={{ p: 0 }}
            >
              <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
                <PersonRoundedIcon />
              </Avatar>
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} aria-label="Logout">
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
