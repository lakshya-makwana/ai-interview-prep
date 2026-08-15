import { Avatar, Box, Typography } from "@mui/material";

export default function Topbar() {
  return (
    <Box
      sx={{
        height: 75,
        borderBottom: "1px solid #334155",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 4,
      }}
    >
      <Typography variant="h5">
        Dashboard
      </Typography>

      <Avatar>L</Avatar>
    </Box>
  );
}