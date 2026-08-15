import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {

  const navigate = useNavigate();

  const { logout } = useAuth();

  function handleLogout() {

    logout();

    navigate("/login");

  }

  return (

    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#0F172A",
        borderBottom: "1px solid #1E293B",
      }}
    >

      <Toolbar
        sx={{
          px: 4,
          py: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >

        <Box>

          <Typography
            variant="h5"
            fontWeight={700}
          >

            AI Resume Dashboard

          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >

            Track • Improve • Get Hired

          </Typography>

        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >

          <Tooltip title="Theme">

            <IconButton>

              <DarkModeOutlinedIcon />

            </IconButton>

          </Tooltip>

          <Tooltip title="Notifications">

            <IconButton>

              <Badge
                badgeContent={2}
                color="primary"
              >

                <NotificationsNoneIcon />

              </Badge>

            </IconButton>

          </Tooltip>

          <Avatar
            sx={{
              bgcolor: "#2563EB",
              width: 42,
              height: 42,
              fontWeight: 700,
            }}
          >

            L

          </Avatar>

          <Tooltip title="Logout">

            <IconButton
              onClick={handleLogout}
            >

              <LogoutIcon />

            </IconButton>

          </Tooltip>

        </Box>

      </Toolbar>

    </AppBar>

  );

}