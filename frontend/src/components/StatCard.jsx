import { Card, CardContent, Typography } from "@mui/material";

export default function StatCard({ title, value }) {
  return (
    <Card
      sx={{
        background: "#1E293B",
        color: "white",
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          sx={{
            color: "#94A3B8",
            fontSize: 15,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mt: 1,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}