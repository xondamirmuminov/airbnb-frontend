import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Container sx={{ textAlignment: "center", py: 5 }}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h4">Page Not Found</Typography>
      <Typography color="text.secondary" >The page you are looking for does not exist.</Typography>
      <Button variant="contained" onClick={() => navigate("/")}>Go Home</Button>
    </Container>
  );
}

export default NotFoundPage;
