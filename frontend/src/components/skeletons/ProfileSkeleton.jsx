import { Box, Skeleton, Stack } from "@mui/material";
import AppCard from "../AppCard";

export default function ProfileSkeleton() {
  return (
    <Stack spacing={3}>
      {/* Profile Header banner */}
      <AppCard>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "center" }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={220} height={36} />
            <Skeleton variant="text" width={180} height={24} sx={{ my: 0.5 }} />
            <Skeleton variant="text" width={140} height={20} />
          </Box>
        </Stack>
      </AppCard>

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
          <AppCard key={i} contentSx={{ p: 2.5, minHeight: 110 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={40} sx={{ my: 1 }} />
            <Skeleton variant="text" width="80%" height={16} />
          </AppCard>
        ))}
      </Box>

      {/* 2 Column breakdown */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.25fr) minmax(320px, 0.75fr)" },
          gap: 3,
        }}
      >
        <AppCard>
          <Skeleton variant="text" width={200} height={28} />
          <Skeleton variant="text" width={300} height={20} sx={{ mb: 2 }} />
          <Stack spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" height={52} sx={{ borderRadius: 2 }} />
            ))}
          </Stack>
        </AppCard>

        <AppCard>
          <Skeleton variant="text" width={180} height={28} />
          <Skeleton variant="text" width={240} height={20} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
        </AppCard>
      </Box>
    </Stack>
  );
}
