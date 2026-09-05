import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export const drawerWidth = 264;

const menuItems = [
  { title: "Dashboard", path: "/", icon: <DashboardRoundedIcon /> },
  { title: "Resume", path: "/resume", icon: <DescriptionRoundedIcon /> },
  { title: "AI Analysis", path: "/analysis", icon: <PsychologyRoundedIcon /> },
  { title: "Mock Interview", icon: <MicRoundedIcon />, comingSoon: true },
  {title: "Coding Practice", path: "/coding", icon: <CodeRoundedIcon />, exact: true,},
  { title: "Favorites", path: "/coding/favorites", icon: <BookmarkRoundedIcon /> },
  { title: "Progress", path: "/coding/progress", icon: <TrendingUpRoundedIcon /> },
  { title: "My Submissions", path: "/coding/submissions", icon: <HistoryRoundedIcon /> },
  { title: "Settings", icon: <SettingsRoundedIcon />, comingSoon: true },
];

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  function handleNavigate(path) {
    navigate(path);
    onNavigate?.();
  }

  function handleLogout() {
    logout();
    navigate("/login");
    onNavigate?.();
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 3 }}>
        <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.main" }}>
          <SmartToyRoundedIcon />
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            AI Interview
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Preparation Platform
          </Typography>
        </Box>
      </Stack>

      <Divider />

      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const active =
            location.pathname === item.path ||
            (!item.exact &&
              item.path !== "/" &&
              location.pathname.startsWith(`${item.path}/`)
            );

          return (
            <ListItemButton
              key={item.title}
              disabled={item.comingSoon}
              onClick={() => item.path && handleNavigate(item.path)}
              sx={{
                mb: 0.75,
                minHeight: 48,
                borderRadius: 2,
                color: active ? "primary.contrastText" : "text.primary",
                bgcolor: active ? "primary.main" : "transparent",
                "&:hover": {
                  bgcolor: active ? "primary.dark" : "action.hover",
                },
                "&.Mui-disabled": {
                  opacity: 0.55,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 700 }} />
              {item.comingSoon && <Chip label="Soon" color="warning" size="small" />}
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, minHeight: 48 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutRoundedIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700 }} />
        </ListItemButton>

        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          sx={{ display: "block", mt: 2 }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen = false, onClose }) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        <SidebarContent onNavigate={onClose} />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}
