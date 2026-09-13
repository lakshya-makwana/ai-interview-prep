import { Box, Stack, Typography } from "@mui/material";

export default function PageHeader({
  title,
  description,
  subtitle,
  action,
  badge,
  breadcrumbs,
  sx = {},
}) {
  const descText = description || subtitle;

  return (
    <Box sx={{ mb: { xs: 2, sm: 2.5 }, ...sx }}>
      {breadcrumbs && <Box sx={{ mb: 1 }}>{breadcrumbs}</Box>}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flexWrap: "wrap", gap: 0.5 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.0625rem", sm: "1.1875rem" },
                letterSpacing: "-0.015em",
                color: "text.primary",
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>
            {badge && <Box sx={{ display: "inline-flex" }}>{badge}</Box>}
          </Stack>

          {descText && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 0.35,
                fontSize: "0.8125rem",
                lineHeight: 1.45,
                maxWidth: 720,
              }}
            >
              {descText}
            </Typography>
          )}
        </Box>

        {action && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "flex-start", sm: "flex-end" },
              "& > *": {
                width: { xs: "auto", sm: "auto" },
              },
            }}
          >
            {action}
          </Box>
        )}
      </Box>
    </Box>
  );
}
