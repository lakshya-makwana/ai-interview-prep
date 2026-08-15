import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

export default function DashboardCard({
  title,
  value,
}) {

  const getIcon = () => {

    switch (title) {

      case "ATS Score":
        return "📊";

      case "Resume":
        return "📄";

      case "Analysis":
        return "🤖";

      default:
        return "✨";

    }

  };

  const getSubtitle = () => {

    switch (title) {

      case "ATS Score":

        if (value === "--") return "Analyze your resume";

        const score = parseInt(value);

        if (score >= 85) return "Excellent";

        if (score >= 70) return "Good";

        return "Needs Improvement";

      case "Resume":

        return value === "Uploaded"
          ? "Ready for analysis"
          : "Upload required";

      case "Analysis":

        return value === "Completed"
          ? "Latest report available"
          : "Not analyzed";

      default:

        return "";

    }

  };

  return (

    <Card
      sx={{

        height: "100%",

        borderRadius: 5,

        background: "#1E293B",

        transition: "0.3s",

        cursor: "pointer",

        border: "1px solid rgba(255,255,255,0.06)",

        "&:hover": {

          transform: "translateY(-6px)",

          boxShadow: "0px 20px 45px rgba(59,130,246,0.18)",

        },

      }}
    >

      <CardContent
        sx={{
          p: 3.5,
        }}
      >

        <Box
          sx={{
            fontSize: 34,
            mb: 2,
          }}
        >

          {getIcon()}

        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
        >

          {title}

        </Typography>

        <Typography
          variant="h3"
          sx={{
            mt: 1,
            fontWeight: 800,
          }}
        >

          {value}

        </Typography>

        <Typography
          sx={{
            mt: 1.5,
            color: "#94A3B8",
            fontSize: 15,
          }}
        >

          {getSubtitle()}

        </Typography>

      </CardContent>

    </Card>

  );

}