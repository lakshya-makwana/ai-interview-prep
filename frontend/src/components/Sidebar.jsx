import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LogoutIcon from "@mui/icons-material/Logout";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menu = [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
    },
    {
      title: "Resume",
      icon: <DescriptionIcon />,
      path: "/resume",
    },
    {
      title: "Analysis",
      icon: <PsychologyIcon />,
      path: "/analysis",
    },
  ];

  return (
    <Box
      sx={{
        width: 270,
        minHeight: "100vh",
        bgcolor: "#0F172A",
        borderRight: "1px solid #1E293B",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >

      <Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 3,
          }}
        >

          <Avatar
            sx={{
              bgcolor: "#2563EB",
              width: 52,
              height: 52,
            }}
          >
            <SmartToyIcon />
          </Avatar>

          <Box>

            <Typography
              variant="h6"
              fontWeight={700}
            >
              AI Interview
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Career Assistant
            </Typography>

          </Box>

        </Box>

        <Divider />

        <List sx={{ mt: 2 }}>

          {menu.map((item) => {

            const active =
              location.pathname === item.path;

            return (

              <ListItemButton
                key={item.title}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 2,
                  mb: 1,
                  borderRadius: 3,
                  bgcolor: active
                    ? "#2563EB"
                    : "transparent",

                  "&:hover": {
                    bgcolor: active
                      ? "#2563EB"
                      : "#1E293B",
                  },
                }}
              >

                <ListItemIcon
                  sx={{
                    color: "white",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.title}
                />

              </ListItemButton>

            );

          })}

        </List>

      </Box>

      <Box sx={{ p: 3 }}>

        <Divider sx={{ mb: 3 }} />

        <ListItemButton
          onClick={() => {

            logout();

            navigate("/login");

          }}
          sx={{
            borderRadius: 3,
          }}
        >

          <ListItemIcon
            sx={{
              color: "#EF4444",
            }}
          >
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
          />

        </ListItemButton>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 3,
            textAlign: "center",
          }}
        >
          Version 1.0.0
        </Typography>

      </Box>

    </Box>
  );
}