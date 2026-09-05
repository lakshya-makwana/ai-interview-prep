import { Paper, Skeleton, Stack } from "@mui/material";

export default function ProblemsSkeleton({ rows = 8 }) {
  return (
    <Paper
      elevation={2}
      sx={{
        mt: 3,
        p: 2.5,
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      {/* Table Header row */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: "divider" }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="15%" height={24} />
        <Skeleton variant="text" width="20%" height={24} />
        <Skeleton variant="text" width="15%" height={24} />
      </Stack>

      {/* Table Body rows */}
      <Stack spacing={2}>
        {Array.from({ length: rows }).map((_, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ py: 1 }}
          >
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width="40%" height={28} />
            <Skeleton variant="rounded" width={70} height={26} sx={{ borderRadius: 1 }} />
            <Skeleton variant="text" width="20%" height={24} />
            <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 1 }} />
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
