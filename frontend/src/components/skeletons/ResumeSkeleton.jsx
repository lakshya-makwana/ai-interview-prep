import { Box, Skeleton, Stack } from "@mui/material";
import AppCard from "../AppCard";

export default function ResumeSkeleton() {
  return (
    <Stack spacing={3}>
      <Box>
        <Skeleton variant="text" width={180} height={40} />
        <Skeleton variant="text" width={420} height={24} sx={{ mt: 0.5 }} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.2fr) minmax(320px, 0.8fr)" },
          gap: 3,
        }}
      >
        <AppCard>
          <Skeleton variant="text" width={160} height={28} />
          <Skeleton variant="text" width={260} height={20} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3 }} />
        </AppCard>

        <AppCard>
          <Skeleton variant="text" width={180} height={28} />
          <Skeleton variant="text" width={220} height={20} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={44} sx={{ borderRadius: 2, mt: 3 }} />
        </AppCard>
      </Box>
    </Stack>
  );
}
