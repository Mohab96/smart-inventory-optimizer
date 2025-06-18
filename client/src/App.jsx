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
import NewProductAddition from "./pages/NewProductAddition/NewProductAddition";
import TransactionsFeeding from "./pages/TransactionsFeeding/TransactionsFeeding";
import ImageUpload from "./pages/ImageUpload";
import YearRevenues from "./pages/dashboard/YearRevenues";
import QuarterlyRevenues from "./pages/dashboard/QuarterlyRevenues";
import Transactions from "./pages/dashboard/Transactions";
import ResetPassword from "./pages/Auth/ResetPassword";
import CsvSubmissions from "./pages/TransactionsFeeding/CsvSubmissions";
import RecommendationPage from "./pages/recommendation/RecommendationPage";
import TrendVisualizer from "./pages/trends/trendVisualizer";
import BusinessAnalyticsDashboard from "./pages/report/Report";
import NotificationsPage from "./pages/NotificationsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoriesSales from "./pages/dashboard/CategoriesSales";
import About from "./pages/About";
import Layout from "./utils/Layout";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
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
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expiryDateProducts"
          element={
            <ProtectedRoute>
              <Layout>
                <ExpiryDateProducts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categoriesExpiringSoon"
          element={
            <ProtectedRoute>
              <Layout>
                <CategoriesExpiringSoon />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/yearRevenues"
          element={
            <ProtectedRoute>
              <Layout>
                <YearRevenues />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quarterRevenues"
          element={
            <ProtectedRoute>
              <Layout>
                <QuarterlyRevenues />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bestCategories"
          element={
            <ProtectedRoute>
              <CategoriesSales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lowStockProducts"
          element={
            <ProtectedRoute>
              <Layout>
                <LowStockProducts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactionsFeeding"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="">
                  <TransactionsFeeding />
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/prediction"
          element={
            <ProtectedRoute>
              <Layout>
                <RecommendationPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trends"
          element={
            <ProtectedRoute>
              <Layout>
                <TrendVisualizer />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/csvsubmissions"
          element={
            <ProtectedRoute>
              <Layout>
                <CsvSubmissions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactionsLog"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="">
                  <Transactions />
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staffmanagement"
          element={
            <ProtectedRoute>
              <Layout>
                <StaffManagement />
              </Layout>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path="/newProductAddition"
          element={
            <ProtectedRoute>
              <Layout>
                <NewProductAddition />
              </Layout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/imageUpload"
          element={
            <ProtectedRoute>
              <Layout>
                <ImageUpload />
              </Layout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/businessAnalytics"
          element={
            <div className="min-h-screen bg-gray-50 ">
              <ProtectedRoute>
                <Layout>
                  <BusinessAnalyticsDashboard />
                </Layout>
              </ProtectedRoute>
            </div>
          }
        ></Route>
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <NotificationsPage />
              </Layout>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
export default App;
