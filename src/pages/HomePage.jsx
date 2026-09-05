import { useQuery, useMutation } from "@apollo/client/react";

import {
  Button,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  CardActionArea,
  Box,
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

function HomePage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { accessToken, user, logout } =
    authStore();

  const { data, loading, error, refetch } =
    useQuery(LISTINGS_QUERY, {
      variables: {
        limit: 5,
        page,
        search,
      },
    });

  const [addFavorite] = useMutation(
    ADD_FAVORITE_MUTATION,
    {
      onCompleted: () => {
        toast.success(
          "Added to favorites!"
        );
        refetch();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  const [removeFavorite] = useMutation(
    REMOVE_FAVORITE_MUTATION,
    {
      onCompleted: () => {
        toast.info(
          "Removed from favorites!"
        );
        refetch();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  const totalPages =
    data?.listings?.pagination?.totalPages || 0;

  const total =
    data?.listings?.pagination?.total;

  const handleFavorite = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    if (!accessToken) {
      toast.info(
        "Please login to add favorites."
      );

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
    confirm("Do you want to log out?");
    logout();
    toast.info("You have been logged out.");
    navigate("/");
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {!accessToken ? (
          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Stack>
        ) : (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Typography>
              Welcome,{" "}
              <b>{user?.name || "User"}</b>
            </Typography>

            <Button
              onClick={() => navigate("/favorites")}
              variant="outlined"
            >
              Favorites
            </Button>

            <Button
              onClick={() => navigate("/bookings")}
              variant="outlined"
            >
              Bookings
            </Button>

            {user?.role === "ADMIN" && (
              <Button
                onClick={() => navigate("/admin")}
                variant="outlined"
              >
                Admin
              </Button>
            )}

            <Button
              color="error"
              variant="outlined"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        )}
      </Box>

      <Typography
        variant="h3"
        gutterBottom
      >
        Find Your Perfect Stay
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Discover comfortable homes and
        unforgettable places.
      </Typography>


      <TextField
        type="text"
        placeholder="Search listings..."
        variant="outlined"
        fullWidth
        sx={{
          mb: 4,
          maxWidth: 400,
        }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {error && (
        <Typography
          color="error"
          sx={{ mb: 2 }}
        >
          {error.message}
        </Typography>
      )}

      {loading && (
        <Typography sx={{ mb: 2 }}>
          Loading...
        </Typography>
      )}

      {total === 0 && !loading && (
        <Typography>
          Nothing found.
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        {data?.listings?.items?.map(
          (item) => (
            <Card
              key={item.id}
              sx={{
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/listings/${item.id}`)}
              >
                {item.images?.length > 0 && (
                  <CardMedia
                    sx={{ height: 200 }}
                    image={item.images[0]}
                    title={item.title}
                  />
                )}

                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    noWrap
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.location}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {" "}
                    {item.rating || "N/A"}
                  </Typography>

                  <Typography
                    variant="body2"
                  >
                    <b>
                      ${item.pricePerNight}
                    </b>{" "}
                    / night
                  </Typography>

                  <Button
                    variant={
                      item.isFavorite
                        ? "contained"
                        : "outlined"
                    }
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() =>
                      handleFavorite(
                        item
                      )
                    }
                  >
                    {item.isFavorite
                      ? "❤️ Favorite"
                      : "♡ Favorite"}
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          )
        )}
      </Box>

      {totalPages > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {Array.from({
            length: totalPages,
          }).map((_, index) => (
            <Button
              key={index}
              variant={
                page === index + 1
                  ? "contained"
                  : "outlined"
              }
              size="small"
              onClick={() =>
                setPage(index + 1)
              }
            >
              {index + 1}
            </Button>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default HomePage;