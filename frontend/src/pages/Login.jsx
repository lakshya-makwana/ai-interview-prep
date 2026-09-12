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

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

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
      setError("Login failed. Please check your email and password.");
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
      <Container maxWidth="xs">
        <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <SmartToyRoundedIcon fontSize="small" />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" fontWeight={800}>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Enter your credentials to access your interview workspace.
            </Typography>
          </Box>
        </Stack>

        <AppCard>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email address"
                type="email"
                size="small"
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
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <Typography variant="body2" align="center" color="text.secondary" sx={{ pt: 1 }}>
                Don&apos;t have an account?{" "}
                <Link component={RouterLink} to="/register" underline="hover" color="primary.main" fontWeight={600}>
                  Create an account
                </Link>
              </Typography>
            </Stack>
          </Box>
        </AppCard>
      </Container>
    </Box>
  );
}
