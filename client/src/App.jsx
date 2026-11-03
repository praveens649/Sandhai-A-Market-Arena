import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Landing page — standalone, no auth required
import LandingPage from "./pages/LandingPage";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Protected full app (user + admin)
import MainApp from "./pages/MainApp";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* ── Public Marketing Landing Page ── */}
              <Route path="/" element={<LandingPage />} />

              {/* ── Auth Routes ── */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* ── Protected Authenticated Zone ── */}
              <Route
                path="/app/*"
                element={
                  <ProtectedRoute>
                    <MainApp />
                  </ProtectedRoute>
                }
              />

              {/* ── Fallback ── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
