import { Chip } from "@mui/material";

export default function StatusChip({ label, color = "default", ...props }) {
  return (
    <Chip
      label={label}
      color={color}
      size="small"
      variant={color === "default" ? "outlined" : "filled"}
      sx={{
        fontWeight: 600,
        ...props.sx,
      }}
      {...props}
    />
  );
}
