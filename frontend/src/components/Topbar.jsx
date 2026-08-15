import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";

export default function Topbar() {

  const navigate = useNavigate();

  const { logout } = useAuth();

  const { dashboard } = useDashboard();

  const atsScore = dashboard.analysis
    ? `${dashboard.analysis.ats_score}%`
    : "--";

  function handleLogout() {

    logout();

    navigate("/login");

  }

  return (

    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#0B1120",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}
    >

      <Toolbar
        sx={{
          height: 72,
          display: "flex",
          justifyContent: "space-between",
          px: 4,
        }}
      >

        <Box>

          <Typography
            variant="h5"
            fontWeight={700}
          >
            Dashboard
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            AI Interview Preparation Platform
          </Typography>

        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >

          <Chip
            icon={<PsychologyRoundedIcon />}
            label={`ATS Score • ${atsScore}`}
            color="primary"
            variant="outlined"
            sx={{
              fontWeight: 600,
            }}
          />

          <Avatar
            sx={{
              bgcolor: "#2563EB",
              width: 42,
              height: 42,
            }}
          >
            <PersonRoundedIcon />
          </Avatar>

          <Tooltip title="Logout">

            <IconButton
              onClick={handleLogout}
            >
              <LogoutRoundedIcon />
            </IconButton>

          </Tooltip>

        </Box>

      </Toolbar>

    </AppBar>

  );

}