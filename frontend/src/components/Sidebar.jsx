import {
  Avatar,
  Box,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menu = [
    {
      title: "Dashboard",
      path: "/",
      icon: <DashboardRoundedIcon />,
    },
    {
      title: "Resume",
      path: "/resume",
      icon: <DescriptionRoundedIcon />,
    },
    {
      title: "AI Analysis",
      path: "/analysis",
      icon: <PsychologyRoundedIcon />,
    },
    {
      title: "Mock Interview",
      icon: <MicRoundedIcon />,
      comingSoon: true,
    },
    {
      title: "Coding Practice",
      icon: <CodeRoundedIcon />,
      comingSoon: true,
    },
    {
      title: "Progress",
      icon: <TrendingUpRoundedIcon />,
      comingSoon: true,
    },
    {
      title: "Settings",
      icon: <SettingsRoundedIcon />,
      comingSoon: true,
    },
  ];

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: "#111827",
        borderRight: "1px solid rgba(255,255,255,.08)",
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
            px: 3,
            py: 3,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#2563EB",
              width: 50,
              height: 50,
            }}
          >
            <SmartToyRoundedIcon />
          </Avatar>

          <Box>
            <Typography
              fontWeight={700}
              fontSize={18}
            >
              AI Interview
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Preparation Platform
            </Typography>
          </Box>
        </Box>

        <Divider />

        <List sx={{ mt: 2 }}>

          {menu.map((item) => {

            const active = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.title}
                disabled={item.comingSoon}
                onClick={() => !item.comingSoon && navigate(item.path)}
                sx={{
                  mx: 2,
                  mb: 1,
                  borderRadius: 2,

                  bgcolor: active ? "#2563EB" : "transparent",

                  "&:hover": {
                    bgcolor: active ? "#2563EB" : "#1F2937",
                  },

                  "&.Mui-disabled": {
                    opacity: 0.55,
                  },
                }}
              >

                <ListItemIcon
                  sx={{
                    color: active ? "white" : "#CBD5E1",
                    minWidth: 42,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText primary={item.title} />

                {item.comingSoon && (
                  <Chip
                    label="Soon"
                    size="small"
                    color="warning"
                  />
                )}

              </ListItemButton>
            );

          })}

        </List>

      </Box>

      <Box sx={{ p: 2 }}>

        <Divider sx={{ mb: 2 }} />

        <ListItemButton
          onClick={() => {
            logout();
            navigate("/login");
          }}
          sx={{
            borderRadius: 2,
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon color="error" />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 2,
          }}
        >
          Version 1.0.0
        </Typography>

      </Box>

    </Box>
  );
}