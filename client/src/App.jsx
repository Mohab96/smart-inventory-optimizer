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
import CategoriesExpiringSoon from "./pages/dashboard/CategoriesExpiringSoon";
import LowStockProducts from "./pages/dashboard/LowStockProducts";
import NewProductAddition from "./pages/newProductAddition/NewProductAddition";
import TransactionsFeeding from "./pages/TransactionsFeeding/TransactionsFeeding";
import ImageUpload from "./pages/ImageUpload";
import YearRevenues from "./pages/dashboard/YearRevenues";
import QuarterlyRevenues from "./pages/dashboard/QuarterlyRevenues";
import Transactions from "./pages/dashboard/Transactions";
import ResetPassword from "./pages/Auth/ResetPassword";
import CsvSubmissions from "./pages/TransactionsFeeding/CsvSubmissions";
import Header from "./components/common/Header";
import RecommendationPage from "./pages/recommendation/RecommendationPage";
import TrendVisualizer from "./pages/trends/trendVisualizer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
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
          path="/forgotpassword"
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/resetpassword"
          element={
            <AuthRoute>
              <ResetPassword />
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
          path="/categoriesExpiringSoon"
          element={
            <ProtectedRoute>
              <CategoriesExpiringSoon />
            </ProtectedRoute>
          }
        />
        <Route
          path="/yearRevenues"
          element={
            <ProtectedRoute>
              <YearRevenues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quarterRevenues"
          element={
            <ProtectedRoute>
              <QuarterlyRevenues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lowStockProducts"
          element={
            <ProtectedRoute>
              <LowStockProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactionsFeeding"
          element={
            <ProtectedRoute>
              <div className="">
                <TransactionsFeeding />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <RecommendationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trends"
          element={
            <ProtectedRoute>
              <TrendVisualizer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/csvsubmissions"
          element={
            <ProtectedRoute>
              <CsvSubmissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactionsLog"
          element={
            <ProtectedRoute>
              <div className="">
                <Transactions />
              </div>
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

        <Route
          path="/newProductAddition"
          element={
            <ProtectedRoute>
              <NewProductAddition />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/imageUpload"
          element={
            <ProtectedRoute>
              <ImageUpload />
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
