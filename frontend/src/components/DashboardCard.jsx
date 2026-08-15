import { Card, CardContent, Typography } from "@mui/material";

export default function DashboardCard({ title, value }) {
  return (
    <Card
      sx={{
        background: "#1E293B",
        height: "170px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          color="text.secondary"
        >
          {title}
        </Typography>

        <Typography
          variant="h3"
          sx={{
            mt: 2,
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}