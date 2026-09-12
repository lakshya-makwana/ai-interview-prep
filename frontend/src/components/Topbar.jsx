import {
  AppBar,
  Avatar,
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

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const dashboardContext = useDashboard();

  const dashboard = dashboardContext?.dashboard ?? {
    resume: null,
    analysis: null,
  };

  const atsScore = dashboard.analysis ? `${dashboard.analysis.ats_score}%` : "Not analyzed";

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
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: 46,
          px: { xs: 2, sm: 2.5 },
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <IconButton
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            size="small"
            sx={{ display: { xs: "inline-flex", lg: "none" }, p: 0.5 }}
          >
            <MenuRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              fontSize: "0.6875rem",
            }}
          >
            AI Career Intelligence
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            icon={<PsychologyRoundedIcon sx={{ fontSize: "14px !important" }} />}
            label={`ATS: ${atsScore}`}
            color={dashboard.analysis ? "primary" : "default"}
            size="small"
            variant="outlined"
            sx={{
              height: 22,
              fontSize: "0.7rem",
              fontWeight: 500,
              display: { xs: "none", sm: "inline-flex" },
            }}
          />

          <Tooltip title="User Profile">
            <IconButton
              onClick={() => navigate("/profile")}
              aria-label="User Profile"
              size="small"
              sx={{ p: 0.5 }}
            >
              <Avatar sx={{ width: 26, height: 26, bgcolor: "primary.main" }}>
                <PersonRoundedIcon sx={{ fontSize: 15 }} />
              </Avatar>
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} aria-label="Logout" size="small" sx={{ p: 0.5 }}>
              <LogoutRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
