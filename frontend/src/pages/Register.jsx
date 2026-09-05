import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";

import api from "../api/api";
import AppCard from "../components/AppCard";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      const credentials = new URLSearchParams();
      credentials.append("username", form.email);
      credentials.append("password", form.password);

      const response = await api.post("/auth/login", credentials, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      login(response.data.access_token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <SmartToyRoundedIcon />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4">Create your account</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Start building a stronger resume and interview workflow.
            </Typography>
          </Box>
        </Stack>

        <AppCard>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
                fullWidth
              />

              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                required
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                required
                fullWidth
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>

              <Typography align="center" color="text.secondary">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login" underline="hover">
                  Login
                </Link>
              </Typography>
            </Stack>
          </Box>
        </AppCard>
      </Container>
    </Box>
  );
}
