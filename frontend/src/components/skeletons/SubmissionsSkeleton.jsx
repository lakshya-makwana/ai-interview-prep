import { Box, Paper, Skeleton, Stack } from "@mui/material";
import AppCard from "../AppCard";

export default function SubmissionsSkeleton() {
  return (
    <Stack spacing={3}>
      <AppCard>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Box>
            <Skeleton variant="text" width={180} height={32} />
            <Skeleton variant="text" width={260} height={20} />
          </Box>
          <Skeleton variant="rounded" width={240} height={40} sx={{ borderRadius: 2 }} />
        </Stack>
      </AppCard>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2} sx={{ pb: 1, borderBottom: 1, borderColor: "divider" }}>
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="text" width="15%" height={24} />
            <Skeleton variant="text" width="20%" height={24} />
            <Skeleton variant="text" width="15%" height={24} />
            <Skeleton variant="text" width="20%" height={24} />
          </Stack>

          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Stack key={i} direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
              <Skeleton variant="text" width="30%" height={28} />
              <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width="15%" height={24} />
              <Skeleton variant="text" width="20%" height={24} />
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
