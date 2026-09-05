import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Stack,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LOGIN_MUTATION } from "../store/query&mutation";
import { authStore } from "../store/authStore";

const ADMIN_EMAIL = "admin@example.com";

function LoginPage() {
  const navigate = useNavigate();
  const loginAction = authStore((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const loginData = data?.login;
      if (!loginData?.accessToken || !loginData?.user) {
        toast.error("Login failed!");
        return;
      }

      const loggedUser = loginData.user;

      if (loggedUser.email === ADMIN_EMAIL || loggedUser.role === "ADMIN") {
        loginAction(loginData.accessToken, loggedUser);
        toast.success("Welcome, Admin!");
        navigate("/admin");
      } else {
        toast.error("You do not have admin rights!");
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    loginMutation({
      variables: {
        email: form.email,
        password: form.password,
      },
    });
  };

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{ width: "100%", maxWidth: 400, p: 4, borderRadius: 3 }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" textAlign="center" fontWeight={600}>
            Admin Login
          </Typography>

          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default LoginPage;