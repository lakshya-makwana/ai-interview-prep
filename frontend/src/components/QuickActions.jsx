import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function QuickActions() {
  return (
    <Card
      sx={{
        background: "#1E293B",
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 3 }}
        >
          Quick Actions
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            fullWidth
          >
            Analyze Resume
          </Button>

          <Button
            variant="outlined"
            fullWidth
          >
            Upload Resume
          </Button>

          <Button
            variant="outlined"
            fullWidth
          >
            View Analysis
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}