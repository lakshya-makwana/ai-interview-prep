import { Box, Typography } from "@mui/material";

export default function SectionHeader({ title, subtitle, action, sx = {} }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1,
        mb: 1.5,
        ...sx,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "text.primary",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              fontSize: "0.75rem",
              mt: 0.25,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
