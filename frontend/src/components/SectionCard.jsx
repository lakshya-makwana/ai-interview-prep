import { Box, Divider } from "@mui/material";
import AppCard from "./AppCard";
import SectionHeader from "./SectionHeader";

export default function SectionCard({
  title,
  subtitle,
  action,
  headerAction,
  children,
  divider = false,
  sx = {},
  contentSx = {},
  ...props
}) {
  const headerActionItem = action || headerAction;

  return (
    <AppCard sx={sx} contentSx={contentSx} {...props}>
      {(title || subtitle || headerActionItem) && (
        <Box sx={{ mb: divider ? 1.5 : 1.75 }}>
          <SectionHeader
            title={title}
            subtitle={subtitle}
            action={headerActionItem}
            sx={{ mb: 0 }}
          />
          {divider && <Divider sx={{ mt: 1.5 }} />}
        </Box>
      )}
      {children}
    </AppCard>
  );
}
