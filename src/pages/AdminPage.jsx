// import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { authStore } from "../store/authStore";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const LOGIN_MUTATION = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        createdAt
        email
        id
        name
      }
      accessToken
    }
  }
`;

const ADMIN_EMAIL = "admin@example.com";

function AdminLogin() {
  const { user, accessToken, setAccessToken, setUser, logout } = authStore();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const [login, { loading, error: apiError }] = useMutation(LOGIN_MUTATION, {
    onCompleted: () => {
      reset();
    },
  });

  const handleLogin = async (formData) => {
    setAuthError("");
    try {
      const { data } = await login({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      const loggedUser = data?.login?.user;
      const token = data?.login?.accessToken;

      if (loggedUser && token) {
        if (loggedUser.email === ADMIN_EMAIL) {
          setAccessToken(token);
          setUser(loggedUser);
        } else {
          setAuthError("Error you are not admin!");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (accessToken && user) {
    return (
      <Container maxWidth="xs" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Welcome, {user.name || user.email}!
        </Typography>
        <Button variant="contained" color="error" onClick={() => logout()}>
          LogOut 
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <form onSubmit={handleSubmit(handleLogin)}>
          <Stack spacing={2}>
            <Typography variant="h5" textAlign="center">
              Admin login
            </Typography>

            {(apiError || authError) && (
              <Alert severity="error">{authError || apiError?.message}</Alert>
            )}

            <Controller
              name="email"
              control={control}
              rules={{ required: "Email required!" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  size="small"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password required!",
                minLength: {
                  value: 6,
                  message: "Password must be 6 characters!!",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  type={showPassword ? "text" : "password"}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={!!error}
                  label="Password"
                  helperText={error?.message}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login Admin"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default AdminLogin;