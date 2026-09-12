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

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export const drawerWidth = 220;

const menuItems = [
  { title: "Dashboard", path: "/", icon: <DashboardRoundedIcon sx={{ fontSize: 18 }} /> },
  { title: "Profile", path: "/profile", icon: <PersonRoundedIcon sx={{ fontSize: 18 }} /> },
  { title: "Resume & Skills", path: "/resume", icon: <DescriptionRoundedIcon sx={{ fontSize: 18 }} /> },
  { title: "Job Description", path: "/job-description", icon: <WorkOutlineRoundedIcon sx={{ fontSize: 18 }} /> },
  { title: "Job Match", path: "/job-match", icon: <CompareArrowsRoundedIcon sx={{ fontSize: 18 }} /> },
  { title: "AI Analysis", path: "/analysis", icon: <PsychologyRoundedIcon sx={{ fontSize: 18 }} /> },
  { title: "Interview", path: "/interview", icon: <MicRoundedIcon sx={{ fontSize: 18 }} /> },
  { title: "Career Readiness", path: "/career-readiness", icon: <AssessmentRoundedIcon sx={{ fontSize: 18 }} /> },
  { title: "Interview History", path: "/interview-history", icon: <HistoryRoundedIcon sx={{ fontSize: 18 }} /> },
  { title: "Settings", icon: <SettingsRoundedIcon sx={{ fontSize: 18 }} />, comingSoon: true },
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
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 2, py: 1.75 }}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1,
            bgcolor: "primary.main",
          }}
        >
          <SmartToyRoundedIcon sx={{ fontSize: 16 }} />
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: "0.8125rem", lineHeight: 1.2 }}>
            Career Intelligence
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: "0.7rem" }}>
            Platform
          </Typography>
        </Box>
      </Stack>

      <Divider />

      <List sx={{ flex: 1, px: 1, py: 1 }}>
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
                mb: 0.25,
                minHeight: 32,
                borderRadius: 1,
                px: 1.25,
                py: 0.5,
                color: active ? "text.primary" : "text.secondary",
                bgcolor: active ? "action.selected" : "transparent",
                borderLeft: active ? "2px solid" : "2px solid transparent",
                borderColor: active ? "primary.main" : "transparent",
                "&:hover": {
                  bgcolor: active ? "action.selected" : "action.hover",
                  color: "text.primary",
                },
                "&.Mui-disabled": {
                  opacity: 0.4,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 26,
                  color: active ? "primary.main" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                slotProps={{
                  primary: {
                    fontSize: "0.775rem",
                    fontWeight: active ? 600 : 500,
                  },
                }}
              />
              {item.comingSoon && (
                <Chip
                  label="Soon"
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: "0.625rem",
                    fontWeight: 600,
                    bgcolor: "action.hover",
                    color: "text.disabled",
                    px: 0.5,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 1 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            minHeight: 32,
            px: 1.25,
            py: 0.5,
            color: "text.secondary",
            "&:hover": {
              bgcolor: "action.hover",
              color: "error.main",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 26, color: "inherit" }}>
            <LogoutRoundedIcon sx={{ fontSize: 17 }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            slotProps={{ primary: { fontSize: "0.775rem", fontWeight: 500 } }}
          />
        </ListItemButton>
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
            bgcolor: "background.paper",
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
            bgcolor: "background.paper",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}
