import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  Box,
} from "@mui/material";

import { authStore } from "../store/authStore";
import { REGISTER_MUTATION } from "../store/query&mutation";
import { Commet } from "react-loading-indicators";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = authStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      const registerData = data?.register;

      if (!registerData?.accessToken) {
        toast.error("Registration failed!");
        return;
      }

      setAccessToken(registerData.accessToken);
      setUser(registerData.user);
      toast.success("Registration successful!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = () => {
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    register({
      variables: {
        name,
        email,
        password,
      },
    });
  };

  return (
    <Container maxWidth="xs">
      <Stack
        sx={{
          minHeight: "100vh",
          justifyContent: "center",
        }}
        spacing={3}
      >
        <Paper elevation={4}>
          <Stack spacing={2} sx={{ padding: 3 }}>
            <Typography variant="h4" textAlign="center">
              Create Account
            </Typography>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
            />

            <Button
              variant="text"
              onClick={() => setShowPassword((prev) => !prev)}
              size="small"
              sx={{ alignSelf: "flex-end" }}
            >
              {showPassword ? "Hide password" : "Show password"}
            </Button>

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <Button
              variant="text"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              size="small"
              sx={{ alignSelf: "flex-end" }}
            >
              {showConfirmPassword ? "Hide password" : "Show password"}
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <Commet color="#316dcc" size="medium" text=" Loading " textColor="#NaNNaNNaN" />
              ) : (
                "Register"
              )}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" component="span">
                Already have an account?{" "}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                onClick={() => navigate("/login")}
                sx={{
                  color: "primary.main",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Login
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default RegisterPage;
