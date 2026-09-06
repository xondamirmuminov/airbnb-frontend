import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, CardMedia, TextField, Typography, Paper, Stack, Grid } from "@mui/material";
import { toast } from "react-toastify";
import { LISTINGS_QUERY, ADD_FAVORITE_MUTATION, REMOVE_FAVORITE_MUTATION } from "../store/query&mutation";
import { authStore } from "../store/authStore";
import { Commet } from "react-loading-indicators";

const ListingsPage = () => {
  const navigate = useNavigate();
  const { accessToken } = authStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data, loading, error, refetch } = useQuery(LISTINGS_QUERY, {
    variables: { limit: 10, page, search },
  });

  const [addFavorite] = useMutation(ADD_FAVORITE_MUTATION, {
    onCompleted: () => { toast.success("Added to favorites!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const [removeFavorite] = useMutation(REMOVE_FAVORITE_MUTATION, {
    onCompleted: () => { toast.info("Removed from favorites!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const handleFavorite = (item) => {
    if (!accessToken) { 
      toast.info("Please login first."); 
      navigate("/login"); 
      return; 
    }
    const mutation = item.isFavorite ? removeFavorite : addFavorite;
    mutation({ variables: { listingId: item.id } });
  };

  const totalPages = data?.listings?.pagination?.totalPages || 0;
  const total = data?.listings?.pagination?.total;
  const items = data?.listings?.items || [];

  const filteredItems = items.filter((item) => {
    if (category && item.category !== category) return false;
    if (location && !item.location?.toLowerCase().includes(location.toLowerCase())) return false;
    if (minPrice && Number(item.pricePerNight) < Number(minPrice)) return false;
    if (maxPrice && Number(item.pricePerNight) > Number(maxPrice)) return false;
    return true;
  });

  return (
    <Box sx={{ p: 4, bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        All Listings
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3.5}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, position: "sticky", top: 24, bgcolor: "#fff" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Filters
            </Typography>
            <Stack spacing={2}>
              <TextField size="small" label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
              <TextField size="small" label="Category" placeholder="HOUSE" value={category} onChange={(e) => setCategory(e.target.value)} />
              <TextField size="small" label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <TextField size="small" label="Min Price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <TextField size="small" label="Max Price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8.5} lg={9}>
          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Commet color="#316dcc" size="medium" text=" Loading " textColor="#NaNNaNNaN" />
            </Box>
          )}
          {error && <Typography color="error" sx={{ mb: 2 }}>{error.message}</Typography>}
          {total === 0 && !loading && <Typography>Nothing found.</Typography>}

          <Grid container spacing={3}>
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} lg={4} key={item.id}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: "none", 
                    border: "1px solid #e0e0e0",
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  {item.images?.length > 0 && (
                    <CardMedia
                      component="img"
                      image={item.images[0]}
                      alt={item.title}
                      sx={{ width: "100%", height: 180, objectFit: "cover" }}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 }}>
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", flex: 1, pr: 1 }} wrap>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                         {item.rating || "New"}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {item.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1.5 }}>
                        <b>${item.pricePerNight}</b> <span style={{ color: "#717171" }}>/ night</span>
                      </Typography>
                      
                      <Stack direction="row" spacing={1}>
                        <Button 
                          variant={item.isFavorite ? "contained" : "outlined"} 
                          color={item.isFavorite ? "error" : "primary"}
                          size="small" 
                          fullWidth
                          onClick={() => handleFavorite(item)}
                          sx={{ textTransform: "none", fontWeight: "600", borderRadius: 1.5 }}
                        >
                          {item.isFavorite ? "❤️ Favorite" : "♡ Favorite"}
                        </Button>
                        
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="primary"
                          fullWidth
                          onClick={() => navigate(`/listings/${item.id}`)}
                          sx={{ textTransform: "none", fontWeight: "600", borderRadius: 1.5 }}
                        >
                          Details
                        </Button>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 0 && (
            <Box sx={{ display: "flex", gap: 1, mt: 5, justifyContent: "center" }}>
              {new Array(totalPages).fill("").map((_, index) => (
                <Button 
                  key={index} 
                  size="small"
                  variant={page === index + 1 ? "contained" : "outlined"} 
                  onClick={() => setPage(index + 1)}
                  sx={{ minWidth: 36, borderRadius: 1.5 }}
                >
                  {index + 1}
                </Button>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListingsPage;
