import { Box, Skeleton, Stack } from "@mui/material";
import AppCard from "../AppCard";

export default function ProblemDetailSkeleton() {
  return (
    <Stack spacing={3}>
      {/* Top Breadcrumb & Action bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
        <Skeleton variant="circular" width={40} height={40} />
      </Stack>

      {/* Two columns: Description & Code Editor */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1.15fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left Column: Problem description */}
        <AppCard>
          <Stack spacing={2}>
            <Skeleton variant="text" width="70%" height={40} />
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 1 }} />
            </Stack>

            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mt: 1 }} />

            <Skeleton variant="text" width="40%" height={28} />
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />

            <Skeleton variant="text" width="35%" height={28} />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Stack>
        </AppCard>

        {/* Right Column: Code Editor & Console */}
        <Stack spacing={3}>
          <AppCard>
            {/* Editor toolbar */}
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
              <Skeleton variant="rounded" width={140} height={40} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rounded" width={100} height={40} sx={{ borderRadius: 2 }} />
            </Stack>

            {/* Editor area */}
            <Skeleton variant="rectangular" height={440} sx={{ borderRadius: 2 }} />

            {/* Run / Submit buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 2.5 }} justifyContent="flex-end">
              <Skeleton variant="rounded" width={110} height={42} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rounded" width={140} height={42} sx={{ borderRadius: 2 }} />
            </Stack>
          </AppCard>

          {/* Test cases output panel */}
          <AppCard>
            <Skeleton variant="text" width={160} height={28} />
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2, mt: 1.5 }} />
          </AppCard>
        </Stack>
      </Box>
    </Stack>
  );
}
