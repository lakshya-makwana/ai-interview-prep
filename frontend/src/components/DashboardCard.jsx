import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";

const config = {
  "ATS Score": {
    icon: <TrendingUpRoundedIcon />,
    color: "#2563EB",
  },
  Resume: {
    icon: <DescriptionRoundedIcon />,
    color: "#22C55E",
  },
  Analysis: {
    icon: <PsychologyRoundedIcon />,
    color: "#A855F7",
  },
  Progress: {
    icon: <TaskAltRoundedIcon />,
    color: "#F59E0B",
  },
};

export default function DashboardCard({ title, value }) {

  const item = config[title];

  function getStatus() {

    switch (title) {

      case "ATS Score":

        if (value === "--") return "Not Analyzed";

        if (parseInt(value) >= 80) return "Excellent";

        if (parseInt(value) >= 70) return "Good";

        return "Needs Improvement";

      case "Resume":

        return value === "Uploaded"
          ? "Ready"
          : "Upload Required";

      case "Analysis":

        return value === "Completed"
          ? "Latest Available"
          : "Pending";

      case "Progress":

        return "Interview Journey";

      default:

        return "";

    }

  }

  return (

    <Card
      elevation={0}
      sx={{
        height: 170,
        borderRadius: 3,
        bgcolor: "#162033",
        border: "1px solid rgba(255,255,255,.08)",
        transition: "all .25s ease",

        "&:hover": {

          transform: "translateY(-5px)",

          borderColor: item.color,

          boxShadow: `0 10px 30px ${item.color}33`,

        },
      }}
    >

      <CardContent
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
          >
            {title}
          </Typography>

          <Box
            sx={{
              color: item.color,
            }}
          >
            {item.icon}
          </Box>

        </Box>

        <Typography
          sx={{
            fontSize: 34,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>

        <Chip
          label={getStatus()}
          size="small"
          sx={{
            width: "fit-content",
            bgcolor: `${item.color}20`,
            color: item.color,
            fontWeight: 700,
          }}
        />

      </CardContent>

    </Card>

  );

}