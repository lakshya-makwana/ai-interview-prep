import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();

      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("========== LOGIN RESPONSE ==========");
      console.log(response.data);
      console.log("===================================");

      const token =
        response.data.access_token ||
        response.data.token ||
        response.data.jwt;

      console.log("TOKEN:", token);

      if (!token) {
        alert("No token returned from backend.");
        return;
      }

      login(token);

      console.log(
        "Saved Token:",
        localStorage.getItem("token")
      );

      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
      }

      alert("Login failed. Check browser console.");
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 500 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                textAlign: "center",
              }}
            >
              Login
            </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.5,
                }}
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}