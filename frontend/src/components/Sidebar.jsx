import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const menu = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
  },

  {
    title: "Resume",
    icon: <DescriptionIcon />,
  },

  {
    title: "Analysis",
    icon: <PsychologyIcon />,
  },

  {
    title: "Settings",
    icon: <SettingsIcon />,
  },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 260,
        background: "#111827",
        minHeight: "100vh",
        borderRight: "1px solid #334155",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          p: 3,
          fontWeight: 700,
        }}
      >
        AI Interview
      </Typography>

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.title}
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 2,
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}