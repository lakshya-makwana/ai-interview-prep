import { useEffect, useState } from "react";

import {
  Backdrop,
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";

const messages = [
  "Reading your resume...",
  "Extracting skills and experience...",
  "Checking ATS compatibility...",
  "Finding missing keywords...",
  "Generating AI recommendations...",
  "Finalizing your report...",
];

export default function LoadingOverlay({ open }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setIndex(0);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => Math.min(current + 1, messages.length - 1));
    }, 2000);

    return () => window.clearInterval(timer);
  }, [open]);

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        bgcolor: (theme) => theme.palette.background.default,
      }}
    >
      <Box sx={{ width: "min(440px, calc(100vw - 48px))", textAlign: "center" }}>
        <CircularProgress size={64} />

        <Typography variant="h5" sx={{ mt: 3 }}>
          AI Resume Analysis
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1, minHeight: 24 }}>
          {messages[index]}
        </Typography>

        <LinearProgress sx={{ mt: 3, height: 8, borderRadius: 999 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Please keep this window open while the report is generated.
        </Typography>
      </Box>
    </Backdrop>
  );
}
