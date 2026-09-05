import { Box, Skeleton, Stack } from "@mui/material";
import AppCard from "../AppCard";

export default function AnalysisSkeleton() {
  return (
    <Stack spacing={3}>
      <Box>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={400} height={24} sx={{ mt: 0.5 }} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "360px minmax(0, 1fr)" },
          gap: 3,
        }}
      >
        <AppCard>
          <Skeleton variant="text" width={140} height={28} />
          <Skeleton variant="text" width={200} height={20} sx={{ mb: 3 }} />
          <Skeleton variant="circular" width={160} height={160} sx={{ mx: "auto", my: 2 }} />
          <Skeleton variant="text" width="60%" height={24} sx={{ mx: "auto" }} />
          <Skeleton variant="rectangular" height={44} sx={{ borderRadius: 2, mt: 3 }} />
        </AppCard>

        <AppCard>
          <Skeleton variant="text" width={220} height={28} />
          <Skeleton variant="text" width={320} height={20} sx={{ mb: 3 }} />
          <Stack spacing={2}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
            ))}
          </Stack>
        </AppCard>
      </Box>
    </Stack>
  );
}
