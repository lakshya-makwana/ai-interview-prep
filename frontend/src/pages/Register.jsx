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
      setError(err.response?.data?.detail || "Registration failed. Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="xs">
        <Stack spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.contrastText",
            }}
          >
            <SmartToyRoundedIcon fontSize="small" />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" fontWeight={800}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Start your automated technical interview preparation.
            </Typography>
          </Box>
        </Stack>

        <AppCard>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Full name"
                size="small"
                autoComplete="name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
                fullWidth
              />

              <TextField
                label="Email address"
                type="email"
                size="small"
                autoComplete="email"
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
                size="small"
                autoComplete="new-password"
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
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{ mt: 1 }}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>

              <Typography variant="body2" align="center" color="text.secondary" sx={{ pt: 1 }}>
                Already have an account?{" "}
                <Link component={RouterLink} to="/login" underline="hover" color="primary.main" fontWeight={600}>
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </Box>
        </AppCard>
      </Container>
    </Box>
  );
}
