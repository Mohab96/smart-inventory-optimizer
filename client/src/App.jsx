import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Start from "./pages/Auth/Start";
import StaffManagement from "./pages/Auth/StaffManagement";
import Dashboard from "./pages/dashboard/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import AuthRoute from "./utils/AuthRoute";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ExpiryDateProducts from "./pages/dashboard/ExpiryDateProducts";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/"
          element={
            <AuthRoute>
              <Start />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expiryDateProducts"
          element={
            <ProtectedRoute>
              <ExpiryDateProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staffmanagement"
          element={
            <ProtectedRoute>
              <StaffManagement />
            </ProtectedRoute>
          }
        ></Route>
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
export default App;
