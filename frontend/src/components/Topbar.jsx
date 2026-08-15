import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  function handleMenu(e) {
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "#0F172A",
        borderBottom: "1px solid #334155",
      }}
    >
      <Toolbar>

        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
          }}
        >
          Dashboard
        </Typography>

        <IconButton onClick={handleMenu}>
          <Avatar>L</Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/");
            }}
          >
            Dashboard
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/resume");
            }}
          >
            Resume
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/analysis");
            }}
          >
            Analysis
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              handleLogout();
            }}
          >
            Logout
          </MenuItem>

        </Menu>

      </Toolbar>
    </AppBar>
  );
}