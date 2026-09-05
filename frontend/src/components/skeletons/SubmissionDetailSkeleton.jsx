import { Box, Skeleton, Stack } from "@mui/material";
import AppCard from "../AppCard";

export default function SubmissionDetailSkeleton() {
  return (
    <Stack spacing={3}>
      <AppCard>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Skeleton variant="text" width={260} height={36} />
            <Skeleton variant="text" width={160} height={20} />
          </Box>
          <Skeleton variant="rounded" width={120} height={32} sx={{ borderRadius: 1 }} />
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
            mt: 3,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </AppCard>

      <AppCard>
        <Skeleton variant="text" width={180} height={28} />
        <Skeleton variant="text" width={260} height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={460} sx={{ borderRadius: 2 }} />
      </AppCard>
    </Stack>
  );
}
