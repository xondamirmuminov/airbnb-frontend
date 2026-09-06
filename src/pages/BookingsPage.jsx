import { useMutation, useQuery } from "@apollo/client/react";
import { Container, Typography, Card, CardContent, Button, Box, Chip } from "@mui/material";
import { toast } from "react-toastify";
import { BOOKINGS_QUERY, CANCEL_BOOKING_MUTATION } from "../store/query&mutation";
import { useNavigate } from "react-router-dom";
import { Commet } from "react-loading-indicators";

function BookingsPage() {
  const { data, loading, error, refetch } = useQuery(BOOKINGS_QUERY);
  const navigate = useNavigate()

  const [cancelBooking, { loading: cancelLoading }] = useMutation(CANCEL_BOOKING_MUTATION, {
    onCompleted: () => { toast.success("Booking cancelled successfully!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  if (loading) return <Box sx={{display: "flex",  alignItems: "center", }}><Commet color="#316dcc" size="medium" text=" Loading " textColor="#NaNNaNNaN" /></Box>;
  if (error) return <Typography color="error" >{error.message}</Typography>;

  const bookings = data?.bookings;

  return (
    <Container>
      <Typography variant="h3" sx={{ my: 4 }}>My Bookings</Typography>
      <Button onClick={() => navigate("/")}>Back to home</Button>
      {bookings.length === 0 ? (
        <Typography variant="h6">You don't have any bookings yet.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent>
                <Typography variant="h5">{booking.listing?.title}</Typography>
                <Typography>{booking.listing?.location}</Typography>
                <Typography>Check-in: {booking.startDate} | Check-out: {booking.endDate}</Typography>
                <Typography>Guests: {booking.guests} | Total: <b>${booking.totalPrice}</b></Typography>
                
                <Chip label={booking.status} color={booking.status === "CONFIRMED" ? "success" : "error"} />

                {booking.status === "CONFIRMED" && (
                  <Button color="error" variant="outlined" sx={{ mt: 2, display: "block" }} disabled={cancelLoading} onClick={() => cancelBooking({ variables: { bookingId: booking.id } })}>
                    {cancelLoading ? "Cancelling..." : "Cancel Booking"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default BookingsPage;
