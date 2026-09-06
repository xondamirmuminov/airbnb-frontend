import { useQuery, useMutation } from "@apollo/client/react";
import { Box, Card, CardContent, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FAVORITES_QUERY, REMOVE_FAVORITE_MUTATION } from "../store/query&mutation";
import { Commet } from "react-loading-indicators";

function FavoritesPage() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(FAVORITES_QUERY);

  const [removeFavorite] = useMutation(REMOVE_FAVORITE_MUTATION, {
    onCompleted: () => { toast.success("Removed from favorites!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  if (loading) return <Box sx={{ p: 4, display: "flex", alignItems: "center" }}><Commet color="#316dcc" size="medium" text=" Loading " textColor="#NaNNaNNaN" /></Box>;
  if (error) return <Typography color="error" sx={{ p: 4 }}>{error.message}</Typography>;

  const favorites = data?.favorites || [];

  return (
    <Container>
      <Typography variant="h3" sx={{ my: 4 }}>My Favorites</Typography>

      {favorites.length === 0 ? (
        <Box >
          <Typography variant="h6" sx={{ mb: 2 }}>You don't have any favorites yet.</Typography>
          <Box sx={{display: "flex", gap: 3}}>
          <Button variant="contained" onClick={() => navigate("/listings")}>View Listings</Button>
          <Button variant="outlined" onClick={() => navigate("/")}>Back to Home</Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "grid", gap: 3 }}>
          {favorites.map((item) => (
            <Card key={item.id} onClick={() => navigate(`/listings/${item.id}`)}>
              {item.images?.length > 0 && (
                <Box component="img" src={item.images[0]} alt={item.title} sx={{ width: "300px", height: 200 }} />
              )}
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography> {item.location} |  {item.rating || "New"}</Typography>
                <Typography sx={{ my: 1 }}>${item.pricePerNight} / night</Typography>
                <Button color="error" variant="outlined" onClick={() => { removeFavorite({ variables: { listingId: item.id } }); }}>
                  Remove Favorite
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default FavoritesPage;
