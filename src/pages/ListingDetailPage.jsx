import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  Box,
  Stack,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import { authStore } from "../store/authStore";
import {
  LISTING_DETAIL_QUERY,
  ADD_FAVORITE_MUTATION,
  REMOVE_FAVORITE_MUTATION,
  CREATE_BOOKING_MUTATION,
} from "../store/query&mutation";
import { Commet } from "react-loading-indicators";

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = authStore((s) => s.accessToken);

  const [form, setForm] = useState({
    start: "",
    end: "",
    guests: 1,
  });

  const { data, loading, error, refetch } = useQuery(LISTING_DETAIL_QUERY, {
    variables: { listingId: id },
  });

  const [addFavorite, { loading: addLoading }] = useMutation(ADD_FAVORITE_MUTATION, {
    onCompleted: () => { toast.success("Added to favorites!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const [removeFavorite, { loading: removeLoading }] = useMutation(REMOVE_FAVORITE_MUTATION, {
    onCompleted: () => { toast.info("Removed from favorites!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const [book, { loading: bookLoading }] = useMutation(CREATE_BOOKING_MUTATION, {
    onCompleted: () => { toast.success("Booking created successfully!"); navigate("/bookings"); },
    onError: (err) => toast.error(err.message),
  });

  const toggleFavorite = () => {
    if (!token) { navigate("/login"); return; }
    const mutation = data?.listing?.isFavorite ? removeFavorite : addFavorite;
    mutation({ variables: { listingId: id } });
  };

  const handleBook = () => {
    if (!token) { navigate("/login"); return; }
    if (!form.start || !form.end) { toast.error("Please select dates."); return; }
    if (form.end <= form.start) { toast.error("Check-out must be after check-in."); return; }
    if (Number(form.guests) < 1 || Number(form.guests) > Number(data?.listing?.guests)) {
      toast.error(`Maximum ${data?.listing?.guests} guests allowed.`);
      return;
    }

    book({
      variables: {
        listingId: id,
        checkIn: form.start,
        checkOut: form.end,
        guests: Number(form.guests),
      },
    });
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center" }}><Commet color="#316dcc" size="medium" text=" Loading " textColor="#NaNNaNNaN" /></Box>;
  if (error) return <Typography color="error">{error.message}</Typography>;
  if (!data?.listing) return <Typography>Listing not found.</Typography>;

  const listing = data.listing;

  return (
    <Container>
      <Button onClick={() => navigate("/")}>
        Back to Listings
      </Button>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>{listing.title}</Typography>
          <Typography color="text.secondary">
            Rating: {listing.rating} . {listing.reviewsCount || 0} reviews . {listing.location}, {listing.address}
          </Typography>
        </Box>
        <Button 
          variant={listing.isFavorite ? "contained" : "outlined"} 
          color={listing.isFavorite ? "error" : "primary"}
          onClick={toggleFavorite} 
          disabled={addLoading || removeLoading}
        >
          {listing.isFavorite ? "Favorited" : "Favorite"}
        </Button>
        
      </Box>

      <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
        {listing.images?.map((image, index) => (
          <Box 
            key={index} 
            component="img" 
            src={image} 
            alt={listing.title} 
            sx={{ width: index === 0 ? 400 : 200, height: 260, borderRadius: 2 }} 
          />
        ))}
      </Box>


      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Category: {listing.category} — {listing.guests} guests . {listing.bedrooms} bedrooms . {listing.beds} beds . {listing.bathrooms} bathrooms
          </Typography>
          
          <Box sx={{ borderTop: "1px solid #ddd", pt: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>Description</Typography>
            <Typography color="text.secondary" style={{ whiteSpace: "pre-line" }}>{listing.description}</Typography>
          </Box>

          <Box sx={{ borderTop: "1px solid #ddd", pt: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>What this place offers</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1}>
              {listing.amenities?.map((item, index) => (
                <Chip key={index} label={item} variant="outlined" />
              ))}
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, border: "1px solid #eaeaea", position: "sticky", top: 24 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              ${listing.pricePerNight} <Box component="span" sx={{ fontSize: "1rem", fontWeight: "normal", color: "text.secondary" }}>/ night</Box>
            </Typography>
            
            <Stack spacing={2.5} sx={{ mt: 2 }}>
              <TextField 
                type="date" 
                fullWidth 
                value={form.start} 
                onChange={(e) => setForm(prev => ({ ...prev, start: e.target.value }))} 
              />
              <TextField 
                type="date" 
                fullWidth 
                value={form.end} 
                onChange={(e) => setForm(prev => ({ ...prev, end: e.target.value }))} 
              />
              <TextField 
                label="Guests" 
                type="number" 
                fullWidth 
                inputProps={{ min: 1, max: listing.guests }}
                value={form.guests} 
                onChange={(e) => setForm(prev => ({ ...prev, guests: e.target.value }))} 
              />
              <Button 
                variant="contained" 
                size="large"
                fullWidth 
                disabled={bookLoading} 
                onClick={handleBook}
                sx={{ textTransform: "none", fontSize: "1rem", fontWeight: "bold", borderRadius: 2 }}
              >
                {bookLoading ? "Booking..." : "Book now"}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ListingDetailPage;