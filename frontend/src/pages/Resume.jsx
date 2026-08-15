import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { uploadResume } from "../services/resumeService";

export default function Resume() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please choose a PDF.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await uploadResume(file);

      setSuccess("Resume uploaded successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ mb: 4 }}
        >
          Upload Resume
        </Typography>

        <Card>
          <CardContent
            sx={{
              textAlign: "center",
              p: 6,
            }}
          >
            <CloudUploadIcon
              sx={{
                fontSize: 70,
                mb: 2,
                color: "primary.main",
              }}
            />

            <Typography variant="h5">
              Upload your Resume
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              PDF files only
            </Typography>

            <Button
              component="label"
              variant="outlined"
              size="large"
            >
              Choose Resume

              <input
                hidden
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </Button>

            {file && (
              <Typography sx={{ mt: 3 }}>
                📄 {file.name}
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              sx={{ mt: 4 }}
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Upload Resume"
              )}
            </Button>

            {success && (
              <Alert
                severity="success"
                sx={{ mt: 3 }}
              >
                {success}
              </Alert>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{ mt: 3 }}
              >
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}