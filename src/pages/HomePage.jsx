import { useQuery, useMutation } from "@apollo/client/react";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  CardActionArea,
  Box,
  Stack,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import {
  LISTINGS_QUERY,
  ADD_FAVORITE_MUTATION,
  REMOVE_FAVORITE_MUTATION,
} from "../store/query&mutation";

import { useState } from "react";
import { authStore } from "../store/authStore";
import { toast } from "react-toastify";
import { Commet } from "react-loading-indicators";

function HomePage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { accessToken, user, logout } = authStore();

  const { data, loading, error, refetch } = useQuery(LISTINGS_QUERY, {
    variables: {
      limit: 9,
      page,
      search,
    },
  });

  const [addFavorite] = useMutation(ADD_FAVORITE_MUTATION, {
    onCompleted: () => {
      toast.success("Added to favorites!");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [removeFavorite] = useMutation(REMOVE_FAVORITE_MUTATION, {
    onCompleted: () => {
      toast.info("Removed from favorites!");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const totalPages = data?.listings?.pagination?.totalPages || 0;
  const total = data?.listings?.pagination?.total;

  const handleFavorite = (item) => {
    if (!accessToken) {
      toast.info("Please login to add favorites.");
      navigate("/login");
      return;
    }

    if (item.isFavorite) {
      removeFavorite({
        variables: {
          listingId: item.id,
        },
      });
    } else {
      addFavorite({
        variables: {
          listingId: item.id,
        },
      });
    }
  };

  const handleLogout = () => {
    if (confirm("Do you want to log out?")) {
      logout();
      toast.info("You have been logged out.");
      navigate("/");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 5, display: "flex", alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>

        <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: "#222" }}>
            Airbnb-mini app
          </Typography>

          <TextField
            type="text"
            placeholder="Search listings (e.g. Jizzax, Hilton)..."
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{
              maxWidth: 500,
              boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
            }}
          />
        </Box>

        <Box sx={{ p: 1 }}>
          {!accessToken ? (
            <Stack direction="row" spacing={1.5}>
              <Button variant="contained" onClick={() => navigate("/register")} sx={{ textTransform: 'none', borderRadius: 2 }}>
                Register
              </Button>
              <Button variant="outlined" onClick={() => navigate("/sign-in")} sx={{ textTransform: 'none', borderRadius: 2 }}>
                Sign In
              </Button>
            </Stack>
          ) : (
            <Stack direction="column" spacing={1.5} alignItems="center" flexWrap="wrap" gap={1}>

              <Box sx={{display:'flex', gap: 3 }}>
              <Typography variant="h6">
                Welcome,{user?.name || "User"}
              </Typography>
              
              <Button color="error" variant="outlined" onClick={handleLogout} sx={{ textTransform: 'none', borderRadius: 2 }}>
                Logout
              </Button>
              </Box>
              
              <Box sx={{display:'flex', gap: 3, justifyContent: 'flex-end' }} > 
              <Button variant="outlined" onClick={() => navigate("/favorites")} sx={{ textTransform: 'none', borderRadius: 2 }}>
                Favorites
              </Button>
              
              <Button variant="outlined" onClick={() => navigate("/bookings")} sx={{ textTransform: 'none', borderRadius: 2 }}>
                Bookings
              </Button>
              </Box>
            </Stack>
          )}
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
          {error.message}
        </Typography>
      )}

      {loading && <Box sx={{ mb: 2, textAlign: "center" }}><Commet color="#316dcc" size="medium" text=" Loading " textColor="#NaNNaNNaN" /></Box>}
      {total === 0 && !loading && <Typography sx={{ textAlign: "center" }}>Nothing found.</Typography>}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 4,
          mb: 5,
        }}
      >
        {data?.listings?.items?.map((item) => (
          <Card
            key={item.id}
            sx={{
              borderRadius: 3, 
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            }}
          >
            <CardActionArea onClick={() => navigate(`/listings/${item.id}`)}>
              {item.images?.length > 0 && (
                <CardMedia
                  sx={{ 
                    height: 220, 
                    borderRadius: "12px 12px 0 0",
                  }}
                  image={item.images[0]} 
                  title={item.title}
                />
              )}

              <CardContent sx={{ p: 2, pb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="600" sx={{ lineHeight: 1.2, flex: 1, pr: 1 }} noWrap>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", fontWeight: "600" }}>
                     {item.rating || "New"}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {item.location}
                </Typography>

                <Typography variant="body1" sx={{ mt: 1 }}>
                  <span style={{ fontWeight: "700" }}>${item.pricePerNight}</span>{" "}
                  <span style={{ color: "#717171", fontSize: "14px" }}>/ night</span>
                </Typography>
              </CardContent>
            </CardActionArea>

            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                variant={item.isFavorite ? "contained" : "outlined"}
                color={item.isFavorite ? "error" : "primary"} 
                size="medium"
                fullWidth
                onClick={() => handleFavorite(item)}
                sx={{ 
                  borderRadius: 2, 
                  textTransform: "none", 
                  fontWeight: "600",
                  py: 0.8 
                }}
              >
                {item.isFavorite ? "❤️ Added to Favorite" : "♡ Add to Favorite"}
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center",
            mt: 4
          }}
        >
          {Array(totalPages)
            .fill(null)
            .map((_, index) => {
              const pageNumber = index + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={page === pageNumber ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setPage(pageNumber)}
                  sx={{ minWidth: 38, borderRadius: 2 }}
                >
                  {pageNumber}
                </Button>
              );
            })}
        </Box>
      )}

    </Container>
  );
}

export default HomePage;
