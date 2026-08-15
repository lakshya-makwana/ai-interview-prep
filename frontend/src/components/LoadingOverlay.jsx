import { useEffect, useState } from "react";

import {
  Backdrop,
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";

export default function LoadingOverlay({ open }) {

  const messages = [
    "Reading your resume...",
    "Extracting skills...",
    "Analyzing ATS compatibility...",
    "Finding missing keywords...",
    "Generating AI recommendations...",
    "Finalizing analysis...",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {

    if (!open) {
      setIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setIndex((prev) =>
        prev < messages.length - 1 ? prev + 1 : prev
      );
    }, 2000);

    return () => clearInterval(timer);

  }, [open]);

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 9999,
        background: "rgba(15,23,42,0.95)",
        color: "white",
      }}
    >
      <Box
        sx={{
          width: 450,
          textAlign: "center",
        }}
      >
        <CircularProgress
          size={70}
          color="inherit"
        />

        <Typography
          variant="h4"
          sx={{
            mt: 4,
            fontWeight: 700,
          }}
        >
          🤖 AI Resume Analysis
        </Typography>

        <Typography
          sx={{
            mt: 2,
            minHeight: 30,
          }}
        >
          {messages[index]}
        </Typography>

        <LinearProgress
          sx={{
            mt: 4,
            height: 8,
            borderRadius: 4,
          }}
        />

        <Typography
          sx={{
            mt: 2,
            opacity: 0.8,
          }}
        >
          Please don't close this window.
        </Typography>
      </Box>
    </Backdrop>
  );
}