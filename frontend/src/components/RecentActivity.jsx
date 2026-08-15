import { Card, CardContent, Divider, Typography } from "@mui/material";

export default function RecentActivity() {
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
          sx={{ mb: 2 }}
        >
          Recent Activity
        </Typography>

        <Typography>
          📄 Resume Uploaded
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography>
          🤖 AI Analysis Completed
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography>
          ⭐ ATS Score Generated
        </Typography>
      </CardContent>
    </Card>
  );
}