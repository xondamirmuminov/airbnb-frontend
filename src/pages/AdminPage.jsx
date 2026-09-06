import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

import { LISTINGS_QUERY, CREATE_LISTING_MUTATION, DELETE_LISTING_MUTATION } from "../store/query&mutation";
import { authStore } from "../store/authStore";
import { Commet } from "react-loading-indicators";
const ADMIN_EMAIL = "admin@example.com";

function AdminPage() {
  const navigate = useNavigate();
  const { accessToken, user, logout } = authStore();

  useEffect(() => {
    if (!accessToken || user?.email !== ADMIN_EMAIL) {
      toast.error("Access denied! Only Admin can access this page.");
      navigate("/login");
    }
  }, [accessToken, user, navigate]);

  const { data, loading, error, refetch } = useQuery(LISTINGS_QUERY, {
    variables: { limit: 100, page: 1, search: "" },
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "HOUSE",
    location: "",
    address: "",
    pricePerNight: "",
    guests: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
    images: "",
    amenities: "",
    isFeatured: false,
  });

  const [createListing, { loading: creating }] = useMutation(CREATE_LISTING_MUTATION, {
    onCompleted: () => {
      toast.success("New listing created successfully! 🏡");
      refetch();
      setForm({
        title: "", description: "", category: "HOUSE", location: "", address: "",
        pricePerNight: "", guests: "", bedrooms: "", beds: "", bathrooms: "",
        images: "", amenities: "", isFeatured: false,
      });
    },
    onError: (err) => toast.error(err.message),
  });

  const [deleteListing] = useMutation(DELETE_LISTING_MUTATION, {
    onCompleted: () => {
      toast.info("Listing deleted.");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.title || !form.location || !form.pricePerNight) {
      toast.error("Please fill in main fields (Title, Location, Price)!");
      return;
    }

    const imagesArray = form.images ? form.images.split(",").map((img) => img.trim()) : [];
    const amenitiesArray = form.amenities ? form.amenities.split(",").map((a) => a.trim()) : [];

    createListing({
      variables: {
        input: {
          title: form.title,
          description: form.description,
          category: form.category,
          location: form.location,
          address: form.address,
          pricePerNight: Number(form.pricePerNight),
          guests: Number(form.guests) || 1,
          bedrooms: Number(form.bedrooms) || 1,
          beds: Number(form.beds) || 1,
          bathrooms: Number(form.bathrooms) || 1,
          images: imagesArray,
          amenities: amenitiesArray,
          isFeatured: form.isFeatured,
        },
      },
    });
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteListing({ variables: { id } });
    }
  };

  if (!accessToken || user?.email !== ADMIN_EMAIL) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 2, borderBottom: "1px solid #ddd" }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Admin Dashboard
        </Typography>
        <Box>
          <Button variant="outlined" onClick={() => navigate("/")} sx={{ mr: 2, borderRadius: 2 }}>
            View Site
          </Button>
          <Button variant="contained" color="error" onClick={() => { logout(); navigate("/"); }} sx={{ borderRadius: 2 }}>
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, position: "sticky", top: 24 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
               Add New Listing
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField label="Title" name="title" value={form.title} onChange={handleChange} size="small" fullWidth required />
              <TextField label="Description" name="description" value={form.description} onChange={handleChange} size="small" fullWidth multiline rows={2} />
              <TextField label="Category (e.g. HOUSE, APARTMENT)" name="category" value={form.category} onChange={handleChange} size="small" fullWidth />
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField label="Location (City)" name="location" value={form.location} onChange={handleChange} size="small" fullWidth required />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Address" name="address" value={form.address} onChange={handleChange} size="small" fullWidth />
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField label="Price per Night ($)" name="pricePerNight" type="number" value={form.pricePerNight} onChange={handleChange} size="small" fullWidth required />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Max Guests" name="guests" type="number" value={form.guests} onChange={handleChange} size="small" fullWidth />
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <TextField label="Bedrooms" name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} size="small" fullWidth />
                </Grid>
                <Grid item xs={4}>
                  <TextField label="Beds" name="beds" type="number" value={form.beds} onChange={handleChange} size="small" fullWidth />
                </Grid>
                <Grid item xs={4}>
                  <TextField label="Bathrooms" name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} size="small" fullWidth />
                </Grid>
              </Grid>

              <TextField label="Images URLs (Separate with comma ',')" name="images" placeholder="http://url1.jpg, http://url2.jpg" value={form.images} onChange={handleChange} size="small" fullWidth />
              <TextField label="Amenities (Separate with comma ',')" name="amenities" placeholder="Wifi, Pool, AC" value={form.amenities} onChange={handleChange} size="small" fullWidth />

              <FormControlLabel
                control={<Checkbox checked={form.isFeatured} onChange={handleChange} name="isFeatured" color="primary" />}
                label="Featured Listing"
              />

              <Button 
                variant="contained" 
                color="success" 
                size="large" 
                disabled={creating} 
                onClick={handleSubmit} 
                sx={{ mt: 1, borderRadius: 2, textTransform: "none" }}
              >
                {creating ? <Commet color="#316dcc" size="medium" text=" Loading " textColor="#NaNNaNNaN" /> : "Publish Listing"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Existing Listings ({data?.listings?.items?.length || 0})
          </Typography>

          {loading && <Box sx={{ textAlign: "center", mt: 4 }}><Commet color="#316dcc" size="medium" text=" Loading houses " textColor="#NaNNaNNaN" /> </Box>}
          {error && <Typography color="error">{error.message}</Typography>}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {data?.listings?.items?.map((item) => (
              <Card key={item.id} sx={{ display: "flex", borderRadius: 2, border: "1px solid #e0e0e0", boxShadow: "none" }}>
                {item.images?.length > 0 && (
                  <CardMedia component="img" sx={{ width: 120, height: 120, objectFit: "cover" }} image={item.images} alt={item.title} />
                )}
                <CardContent sx={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, "&:last-child": { pb: 2 } }}>
                  <Box sx={{ maxWidth: "80%" }}>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.location}</Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary.main" sx={{ mt: 0.5 }}>${item.pricePerNight} / night</Typography>
                  </Box>
                  <Button color="error" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminPage;
