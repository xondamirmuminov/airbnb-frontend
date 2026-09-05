import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FavoritesPage from "./pages/FavoritesPage";
import BookingsPage from "./pages/BookingsPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

import { authStore } from "./store/authStore";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function OnlyVisit({ children }) {
  const token = authStore((s) => s.accessToken);

  return token ? children : <Navigate to="/login" replace />;
}

function OnlyNotVisit({ children }) {
  const token = authStore((s) => s.accessToken);

  return token ? <Navigate to="/" replace /> : children;
}

function OnlyAdmin({ children }) {
  const { accessToken, user } = authStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/listings" element={<ListingsPage />} />

        <Route
          path="/listings/:id"
          element={<ListingDetailPage />}
        />

        <Route
          path="/login"
          element={
            <OnlyNotVisit>
              <LoginPage />
            </OnlyNotVisit>
          }
        />

        <Route
          path="/register"
          element={
            <OnlyNotVisit>
              <RegisterPage />
            </OnlyNotVisit>
          }
        />

        <Route
          path="/favorites"
          element={
            <OnlyVisit>
              <FavoritesPage />
            </OnlyVisit>
          }
        />

        <Route
          path="/bookings"
          element={
            <OnlyVisit>
              <BookingsPage />
            </OnlyVisit>
          }
        />

        <Route
          path="/admin"
          element={
            <OnlyAdmin>
              <AdminPage />
            </OnlyAdmin>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </BrowserRouter>
  );
}
