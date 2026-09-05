import { Box, Skeleton, Stack } from "@mui/material";
import AppCard from "../AppCard";

export default function DashboardSkeleton() {
  return (
    <Stack spacing={3}>
      {/* Top Welcome / Header */}
      <Box>
        <Skeleton variant="text" width={220} height={40} />
        <Skeleton variant="text" width={380} height={24} sx={{ mt: 0.5 }} />
      </Box>

      {/* 4 Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <AppCard key={i} contentSx={{ p: 2.5, minHeight: 120 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={48} sx={{ my: 1 }} />
            <Skeleton variant="text" width="80%" height={16} />
          </AppCard>
        ))}
      </Box>

      {/* 2 Main Sections */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.25fr) minmax(320px, 0.75fr)" },
          gap: 3,
        }}
      >
        <Stack spacing={3}>
          <AppCard>
            <Skeleton variant="text" width={180} height={28} />
            <Skeleton variant="text" width={280} height={20} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
          </AppCard>

          <AppCard>
            <Skeleton variant="text" width={140} height={28} />
            <Skeleton variant="text" width={240} height={20} sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={90} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          </AppCard>
        </Stack>

        <Stack spacing={3}>
          <AppCard>
            <Skeleton variant="text" width={160} height={28} />
            <Skeleton variant="text" width={220} height={20} sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" height={64} sx={{ borderRadius: 2 }} />
              ))}
            </Stack>
          </AppCard>
        </Stack>
      </Box>
    </Stack>
  );
}
