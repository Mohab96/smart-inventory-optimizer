import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectToken } from "../store/features/authSlice";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectToken);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ProtectedRoute;
