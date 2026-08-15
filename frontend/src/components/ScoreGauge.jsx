import { Box, CircularProgress, Typography } from "@mui/material";

export default function ScoreGauge({ score }) {

    let color = "#ef4444";

    if (score >= 80) color = "#22c55e";
    else if (score >= 60) color = "#f59e0b";

    return (
        <Box
            sx={{
                position: "relative",
                display: "inline-flex",
            }}
        >
            <CircularProgress
                variant="determinate"
                value={100}
                size={170}
                thickness={4}
                sx={{
                    color: "#334155",
                }}
            />

            <CircularProgress
                variant="determinate"
                value={score}
                size={170}
                thickness={4}
                sx={{
                    color,
                    position: "absolute",
                    left: 0,
                }}
            />

            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                <Typography variant="h3">
                    {score}%
                </Typography>

                <Typography color="text.secondary">
                    ATS Score
                </Typography>
            </Box>
        </Box>
    );
}