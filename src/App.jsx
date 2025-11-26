import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import AppointmentDetailPage from './pages/AppointmentDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppointmentProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book"
              element={
                <ProtectedRoute>
                  <BookAppointmentPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <MyAppointmentsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute>
                  <AppointmentDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#212121',
                color: '#fff',
                borderRadius: '8px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#4CAF50',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#F44336',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AppointmentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

